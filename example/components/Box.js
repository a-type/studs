import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const selector = theme
  .register('Box', theme => ({
    outerColor: theme.colors.primary,
    innerColor: theme.colors.secondary,
    outerPadding: '15px',
    innerPadding: '12px',
  }))
  .addVariant('inverted', theme => ({
    outerColor: theme.colors.secondary,
    innerColor: theme.colors.primary,
  }))
  .createSelector();

const Outer = theme.connect(styled.div`
  padding: ${selector('outerPadding')};
  background: ${selector('outerColor')};
`);

const Inner = theme.connect(styled.div`
  padding: ${selector('innerPadding')};
  background: ${selector('innerColor')};
`);

class Box extends React.Component {
  render() {
    return (
      <Outer>
        <Inner />
      </Outer>
    );
  }
}

Box.Inverted = theme.variant('inverted')(Box);

export default Box;
