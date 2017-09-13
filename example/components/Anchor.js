import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const select = theme
  .register('anchor', theme => ({
    color: theme.colors.primary,
    fontWeight: 'bold',
  }))
  .addVariant('secondary', theme => ({
    color: theme.colors.secondary,
  }))
  .createSelector();

const AnchorImpl = theme.connect(styled.a`
  color: ${select('color')};
  font-weight: ${select('fontWeight')};
  text-decoration: underline;
  font-family: sans-serif;
`);

AnchorImpl.Default = theme.variant('default')(AnchorImpl);
AnchorImpl.Secondary = theme.variant('secondary')(AnchorImpl);

export const Anchor = ({ children, ...rest }) => (
  <AnchorImpl {...rest}>{children}</AnchorImpl>
);

export default AnchorImpl;
