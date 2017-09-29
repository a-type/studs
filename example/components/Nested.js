import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import Anchor from './Anchor';

const selector = theme
  .register('Nested', theme => ({
    background: theme.colors.secondary,
  }))
  .addVariant('secondary', () => ({
    background: 'white',
  }))
  .createSelector();

const Container = theme.connect(styled.div`
  background: ${selector('background')};
`);

class Nested extends React.Component {
  render() {
    return (
      <Container>
        <Anchor href="#">Anchor mimics parent variant</Anchor>
        <br />
        <Anchor.Default href="#">
          Anchor.Default enforces default variant
        </Anchor.Default>
      </Container>
    );
  }
}

Nested.Secondary = theme.variant('secondary')(Nested);

export default Nested;
