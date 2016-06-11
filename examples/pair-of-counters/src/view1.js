// @flow

import React from 'react';
import shallowEqual from 'recompose/shallowEqual';
import createElement from 'recompose/createElement';
import getDisplayName from 'recompose/getDisplayName';

interface IViewProps {
  [k: string]: any;
  dispatch: (action: any) => void;
}

export default function<TProps: IViewProps>(ViewComponent: ReactClass<TProps>): ReactClass<TProps> {
// export default function<TProps: IViewProps>(ViewComponent: (props: TProps) => any): Class<React$Component<void, TProps, void>> {
  class View extends React.Component<void, TProps, void> {
    props: TProps;
    dispatch: (action: any) => void;

    constructor(props: any) {
      super(props);

      this.dispatch = this.dispatch.bind(this);
    }

    shouldComponentUpdate(nextProps: Object) {
      return Object.keys(this.props).some(prop => {
        return (prop !== 'dispatch' && !shallowEqual(this.props[prop], nextProps[prop]));
      });
    }

    dispatch(action: any) {
      this.props.dispatch(action);
    }

    /*
    forwardTo(tag) {
      return (msg) => {
        this.props.address(tag(msg));
      }
    }
    */

    render() {
      return <ViewComponent {...this.props} dispatch={this.dispatch} />
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
