import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import { spreadStyles } from '../../src';

const select = theme
  .register('Button', theme => ({
    color: theme.colors.primary,
    background: theme.colors.secondary,
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '14px',
  }))
  .addVariant('small', { fontSize: '11px', padding: '2px 4px' })
  .createSelector();

const ButtonImpl = theme.connect(styled.button`${spreadStyles(select)};`);

export const Button = ({ children, ...rest }) => (
  <ButtonImpl {...rest}>{children}</ButtonImpl>
);

ButtonImpl.Small = theme.variant('small')(Button);

export default ButtonImpl;
