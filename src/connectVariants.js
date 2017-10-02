import React from 'react';
import PropTypes from 'prop-types';

export const CONTEXT_KEY = 'styled_library_themer';
export const contextType = PropTypes.shape({
  variants: PropTypes.arrayOf(PropTypes.string),
});

export default WrappedComponent => {
  return class VariantWrapper extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextTypes = {
      [CONTEXT_KEY]: contextType,
    };

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
