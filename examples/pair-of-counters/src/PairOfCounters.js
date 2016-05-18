import t from 'tcomb';
import React from 'react';
import {tag, union, elmView} from 'tcomb-redux-elm';

import Counter from './Counter';

// MODEL

const Model = t.interface({
  topCounter: Counter.Model,
  bottomCounter: Counter.Model
})

function init(topCount = 0: t.Number, bottomCount = 0: t.Number): Model { 
  return {
    topCounter: Counter.init(topCount),
    bottomCounter: Counter.init(bottomCount)
  };
}

// UPDATE

const Reset = tag('Reset');
const TopCounter = tag('TopCounter', Counter.Msg);
const BottomCounter = tag('BottomCounter', Counter.Msg);
const Msg = union(Reset, TopCounter, BottomCounter);

function update(model: Model, msg: Msg): Model {
  return Msg.match(msg,

    Reset, () => init(),

    TopCounter, msg => ({
      ...model,
      topCounter: Counter.update(model.topCounter, msg)
    }),

    BottomCounter, msg => ({
      ...model,
      bottomCounter: Counter.update(model.bottomCounter, msg)
    })

  );
}

// VIEW

const view = elmView(({ model, address, forwardTo }) => (
  <div>
    <Counter.view model={model.topCounter} address={forwardTo(TopCounter)} />
    <Counter.view model={model.bottomCounter} address={forwardTo(BottomCounter)} />
    <button onClick={() => address(Reset)}>RESET</button>
  </div>
));

export default { Model, init, Msg, update, view };
