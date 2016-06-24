import React from 'react';
import {view, Effects, isEffect, forwardTo} from 'redux-elmish';

const undefinedSubjectInit = () => [null, Effects.none()];
const undefinedSubjectUpdate = () => [model, Effects.none()];
const UndefinedSubjectView = () => <h2>Please define testing subject in ./subject.js module</h2>

let subjectVariants;
try {
  subjectVariants = require('./subject').default;
  if (subjectVariants == null) throw 'invalid subject';
} catch (_) {
  subjectVariants = {
    default: {
      init: undefinedSubjectInit,
      update: undefinedSubjectUpdate,
      View: UndefinedSubjectView
    }
  };
}

const getDefaultVariant = () => (subjectVariants.default) ? 'default' : Object.keys(subjectVariants)[0];
const getVariants = () => Object.keys(subjectVariants);

const assertVariant = variant => {
  let errors = [];

  const Subject = subjectVariants[variant];
  if (Subject.init == null) errors.push('init is missing');
  if (Subject.update == null) errors.push('update is missing');
  if (Subject.View == null) errors.push('View is missing');

  if (errors.length > 0) throw new Error(`Testing subject's variant ${variant} is invalid: ${errors.join('; ')}`);
}

const init = () => {
  assertVariant(getDefaultVariant());
  const Subject = subjectVariants[getDefaultVariant()];
  let subject = Subject.init();
  if (!Array.isArray(subject) || subject.length < 2 || !isEffect(subject[1]))
    subject = [subject, Effects.none()];
  const [subjectModel, subjectFx] = subject;
  return [
    { variant: getDefaultVariant(), subject: subjectModel, subjectResults: subject.slice(2) },
    Effects.map(subjectFx, subjectAction => ({ type: 'Subject', subjectAction }))
  ];
}

const update = (model, action) => {
  switch (action.type) {
  case 'ChangeVariant': {
    assertVariant(action.variant);
    const Subject = subjectVariants[action.variant];
    let subject = Subject.init();
    if (!Array.isArray(subject) || subject.length < 2 || !isEffect(subject[1]))
      subject = [subject, Effects.none()];
    const [subjectModel, subjectFx] = subject;
    return [
      { variant: action.variant, subject: subjectModel },
      Effects.map(subjectFx, subjectAction => ({ type: 'Subject', subjectAction }))
    ];
  }
  case 'Subject': {
    const Subject = subjectVariants[model.variant];
    let subject = Subject.update(model.subject, action.subjectAction);
    if (!Array.isArray(subject) || subject.length < 2 || !isEffect(subject[1]))
      subject = [subject, Effects.none()];
    const [subjectModel, subjectFx] = subject;
    return [
      { ...model, subject: subjectModel, subjectResults: subject.slice(2) },
      Effects.map(subjectFx, subjectAction => ({ type: 'Subject', subjectAction }))
    ];
  }
  default: throw new Error(`Unknown action type ${action.type}`);
  }
}

export const View = view(({ model, dispatch }) => {
  const Subject = subjectVariants[model.variant];
  return (
    <div>
      {getVariants().length > 1 &&
        <span>
          <select value={model.variant} onChange={event => dispatch({ type: 'ChangeVariant', variant: event.target.value})}>
            {getVariants().map(variant => <option key={variant} value={variant}>{variant}</option>)}
          </select>
          <span style={{marginLeft: '10px'}}>{Subject.description}</span>
        </span>
      }
      <Subject.View model={model.subject} dispatch={forwardTo(dispatch, subjectAction => ({ type: 'Subject', subjectAction }))} />
    </div>
  )
});

export default { init, update };
