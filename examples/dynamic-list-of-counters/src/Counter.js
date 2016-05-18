import t from 'tcomb';
import React from 'react';
import {tag, union, elmView} from 'tcomb-redux-elm';

// MODEL
const Model = t.Number;

function init(count = 0: t.Number): Model { return count; }

// UPDATE

const Increment = tag('Increment');
const Decrement = tag('Decrement');
const Msg = union(Increment, Decrement);

function update(model: Model, msg: Msg): Model {
  return Msg.match(msg,

    Increment, () => model + 1,

    Decrement, () => model - 1

  );
}

// VIEW

const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
};

const view = elmView(({ model, address }) => (
  <div>
    <button onClick={() => address(Decrement)}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => address(Increment)}>+</button>
  </div>
));

export default { Model, init, Msg, update, view };
