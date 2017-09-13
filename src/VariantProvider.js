import React from 'react';
import { CONTEXT_KEY, contextType } from './connectTheme';

export default class VariantProvider extends React.Component {
  static childContextTypes = {
    [CONTEXT_KEY]: contextType,
  };

  getChildContext() {
    return {
      [CONTEXT_KEY]: {
        variant: this.props.variant,
      },
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export const asVariant = (variant = 'default') => WrappedComponent => props => (
  <VariantProvider variant={variant}>
    <WrappedComponent {...props} />
  </VariantProvider>
);
