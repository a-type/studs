import React from 'react';
import { ThemeProvider } from 'styled-components';

export default theme => props => (
  <ThemeProvider theme={theme.compile()}>
    {React.Children.only(props.children)}
  </ThemeProvider>
);
