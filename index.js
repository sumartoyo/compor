import React from 'react';

const PREFIX_KEEP = 'keep_';
const PREFIX_KEEP_LENGTH = PREFIX_KEEP.length;

export default class Compor extends React.Component {
  render() {
    const Component = this.props.ctype;
    const props = {};

    Object.keys(this.props).forEach(key => {
      if (key === 'ctype') {
        // do nothing
      } else if (key.startsWith(PREFIX_KEEP)) {
        props[key.substr(PREFIX_KEEP_LENGTH)] = this.props[key];
      } else {
        props[key] = this.props[key];
      }
    });

    if (typeof(props.children) === 'function') {
      props.children = props.children();
    }

    return <Component {...props} />;
  }

  shouldComponentUpdate(nextProps) {
    const prevKeys = Object.keys(this.props);
    const nextKeys = Object.keys(nextProps);
    if (prevKeys.length !== nextKeys.length) return true;

    for (let key of nextKeys) {
      if (key.startsWith(PREFIX_KEEP)) continue;
      if (key === 'children' && typeof(this.props[key]) === 'function') continue;
      if (this.props[key] !== nextProps[key]) return true;
    }

    return false;
  }
}

export const Nothing = props => props.children;
