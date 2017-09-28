import React from 'react';
import PropTypes from 'prop-types';
import { CONTEXT_KEY, contextType } from './connectVariants';
import _ from 'lodash';

export default class VariantProvider extends React.Component {
  static propTypes = {
    variants: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    compose: PropTypes.bool,
  };

  static defaultProps = {
    compose: false,
  };

  static childContextTypes = {
    [CONTEXT_KEY]: contextType,
  };

  getChildContext() {
    if (this.props.compose) {
      const parentVariants = this.context[CONTEXT_KEY]
        ? this.context[CONTEXT_KEY].variants
        : {};
      return {
        [CONTEXT_KEY]: {
          variants: [...parentVariants, ...this.getVariantArray()],
        },
      };
    }

    return {
      [CONTEXT_KEY]: {
        variants: this.getVariantArray(),
      },
    };
  }

  getVariantArray = () => {
    if (_.isArray(this.props.variants)) {
      return this.props.variants;
    }
    return [this.props.variants];
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export const asVariant = (
  variants = ['default'],
  compose = false,
) => WrappedComponent => props => (
  <VariantProvider variants={variants} compose={compose}>
    <WrappedComponent {...props} />
  </VariantProvider>
);
