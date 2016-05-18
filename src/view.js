import {Component} from 'react';
import shallowEqual from 'recompose/shallowEqual';
import createElement from 'recompose/createElement';
import getDisplayName from 'recompose/getDisplayName';
import t from 'tcomb';

export default function(BaseComponent) {
  class View extends Component {
    constructor(props) {
      super(props);

      this.address = this.address.bind(this);
      this.forwardTo = this.forwardTo.bind(this);
    }

    shouldComponentUpdate(nextProps) {
      return Object.keys(this.props).some(prop => {
        return (prop !== 'address' && !shallowEqual(this.props[prop], nextProps[prop]));
      });
    }

    address(msg) {
      if (t.isType(msg) && msg.meta.kind === 'tag') {
        // TODO: assert da u address sme da se prosledi sam konstruktor samo ako ne taguje parametre
        // tj. msg.meta.types.length === 0
        msg = msg();
      }
      this.props.address(msg);
    }

    forwardTo(tag) {
      return (msg) => {
        this.props.address(tag(msg));
      }
    }

    render() {
      return createElement(BaseComponent, {
        ...this.props,
        address: this.address,
        forwardTo: this.forwardTo
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    View.displayName = `TcombReduxElmView(${getDisplayName(BaseComponent)})`;
  }

  return View;
}
