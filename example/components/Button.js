import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const select = theme
  .register('button', theme => ({
    color: theme.colors.primary,
    background: theme.colors.secondary,
    borderRadius: '4px',
    padding: '4px 8px',
  }))
  .createSelector();

const ButtonImpl = theme.connect(styled.button`
  color: ${select('color')};
  background: ${select('background')};
  border-radius: ${select('borderRadius')};
  padding: ${select('padding')};
`);

export const Button = ({ children, ...rest }) => (
  <ButtonImpl {...rest}>{children}</ButtonImpl>
);

export default ButtonImpl;
