import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const CONTEXT_KEY = 'styled_library_themer';
export const contextType = PropTypes.shape({
  variants: PropTypes.arrayOf(PropTypes.string),
});

export default (WrappedComponent, options = {}) => {
  return class VariantWrapper extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextTypes = {
      [CONTEXT_KEY]: contextType,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      if (_.get(options, 'pure')) {
        return !_.isEqual(this.getVariants(), this.getVariants(nextContext));
      } else {
        return !(
          _.isEqual(nextProps, this.props) &&
          _.isEqual(nextState, this.state) &&
          _.isEqual(nextContext, this.context)
        );
      }
    }

    getVariants = context =>
      ((context || this.context || {})[CONTEXT_KEY] || { variants: null })
        .variants;

    render() {
      const {
        [CONTEXT_KEY]: { variants } = { variants: ['default'] },
      } = this.context;
      const { children, ...rest } = this.props;
      return (
        <WrappedComponent {...rest} variants={variants} variant={variants}>
          {children}
        </WrappedComponent>
      );
    }
  };
};
