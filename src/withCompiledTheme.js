import React from 'react';
import _ from 'lodash';

/**
 * HOC that provides a compiled theme to a wrapped ThemeProvider component as a `theme` prop.
 */
export default (theme, options = { themePropName: 'theme' }) => ThemeProvider =>
  class ThemeCompiler extends React.Component {
    constructor(props) {
      super(props);
      this.state = { compiled: theme.compile() };
    }

    componentDidMount() {
      if (theme.enableRecompile) {
        setImmediate(() => {
          theme.subscribe(this.handleEvent);
        });
      }
    }

    componentWillUnmount() {
      theme.unsubscribe(this.handleEvent);
    }

    handleEvent = event => {
      switch (event.type) {
        case 'COMPONENT_REGISTRATION':
        case 'VARIANT_REGISTRATION':
          this.setState({ compiled: theme.compile() });
          break;
        default:
          break;
      }
    };

    render() {
      const providedProps = {
        [_.get(options, 'themePropName')]: this.state.compiled,
      };

      return (
        <ThemeProvider {...providedProps}>{this.props.children}</ThemeProvider>
      );
    }
  };
