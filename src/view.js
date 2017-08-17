import React from 'react';
import shallowEqual from 'recompose/shallowEqual';
// import createElement from 'recompose/createElement';
import getDisplayName from 'recompose/getDisplayName';

export default function (ViewComponent) {
  class View extends React.Component {
    constructor(props) {
      super(props);

      this.dispatch = this.dispatch.bind(this);
    }

    shouldComponentUpdate(nextProps) {
      return Object.keys(this.props).some(prop => { // eslint-disable-line arrow-body-style
        return (prop !== 'dispatch' && !shallowEqual(this.props[prop], nextProps[prop]));
      });
    }

    dispatch(action) {
      this.props.dispatch(action); // eslint-disable-line react/prop-types
    }

    /*
    forwardTo(tag) {
      return (msg) => {
        this.props.address(tag(msg));
      }
    }
    */

    render() {
      return <ViewComponent {...this.props} dispatch={this.dispatch} />;
      /*
      return createElement(BaseComponent, {
        ...this.props,
        address: this.address,
        forwardTo: this.forwardTo
      });
      */
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    View.displayName = `View(${getDisplayName(ViewComponent)})`;
  }

  return View;
}
