import t from 'tcomb';
import React from 'react';
import {tag, union, elmView} from 'tcomb-redux-elm';

import Counter from './Counter';

// MODEL

const Model = t.interface({
  counters: t.list(Counter.Model)
})

function init(): Model { 
  return {
    counters: []
  };
}

// UPDATE

const Insert = tag('Insert');
const Remove = tag('Remove');
const ChangeCounter = tag('ChangeCounter', t.Integer, Counter.Msg);
const Msg = union(Insert, Remove, ChangeCounter);

function update(model: Model, msg: Msg): Model {
  return Msg.match(msg,

    Insert, () => ({
      ...model,
      counters: [...model.counters, Counter.init()]
    }),
    
    Remove, () => ({
      ...model,
      counters: model.counters.slice(0, model.counters.length - 1)
    }),

    ChangeCounter, (index, msg) => ({
      ...model,
      counters: [
        ...model.counters.slice(0, index),
        Counter.update(model.counters[index], msg),
        ...model.counters.slice(index + 1)
      ]
    })

  );
}

// VIEW

const view = elmView(({ model, address, forwardTo }) => (
  <div>
    <button onClick={() => address(Remove)}>Remove</button>
    <button onClick={() => address(Insert)}>Add</button>
    {model.counters.map((counterModel, index) => (
      <Counter.view key={index} model={counterModel} address={forwardTo(ChangeCounter(index))} />
    ))}
  </div>
));

export default { Model, init, Msg, update, view };
