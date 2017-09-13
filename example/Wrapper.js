import React from 'react';
import { Provider } from './theme';

export default class Wrapper extends React.Component {
  render() {
    return <Provider>{React.Children.only(this.props.children)}</Provider>;
  }
}
