import React from 'react';
import PropTypes from 'prop-types';

export const CONTEXT_KEY = 'styled_library_themer';
export const contextType = PropTypes.shape({
  variant: PropTypes.string,
});

export default WrappedComponent => {
  return class VariantWrapper extends React.Component {
    static contextTypes = {
      [CONTEXT_KEY]: contextType,
    };

    render() {
      const {
        [CONTEXT_KEY]: { variant } = { variant: 'default' },
      } = this.context;
      const { children, ...rest } = this.props;
      return (
        <WrappedComponent {...rest} variant={variant}>
          {children}
        </WrappedComponent>
      );
    }
  };
};
