import React from 'react';
import Theme, { createThemeProvider } from '../src';
import styled, { ThemeProvider } from 'styled-components';

const namespace = 'exampleTheme';

const globals = {
  colors: {
    primary: '#133337',
    secondary: '#4ac9e2',
    black: 'black',
    white: 'white',
  },
};

const theme = new Theme(namespace, globals);
export default theme;

export const Provider = createThemeProvider(theme);
