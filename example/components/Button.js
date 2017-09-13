import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import { spreadStyles } from '../../src';

const select = theme
  .register('button', theme => ({
    color: theme.colors.primary,
    background: theme.colors.secondary,
    borderRadius: '4px',
    padding: '4px 8px',
  }))
  .createSelector();

const ButtonImpl = theme.connect(styled.button`${spreadStyles(select)};`);

export const Button = ({ children, ...rest }) => (
  <ButtonImpl {...rest}>{children}</ButtonImpl>
);

export default ButtonImpl;
