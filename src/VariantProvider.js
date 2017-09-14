import React from 'react';
import PropTypes from 'prop-types';
import { CONTEXT_KEY, contextType } from './connectVariants';

export default class VariantProvider extends React.Component {
  static propTypes = {
    variant: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  };

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
