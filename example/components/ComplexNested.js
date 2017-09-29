import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import Button from './Button';

const selector = theme
  .register('ComplexNested', theme => ({
    background: theme.colors.secondary,
  }))
  .addVariant('complexNested', theme => ({
    background: theme.colors.primary,
  }))
  .createSelector();

theme.registerVariant('Button', 'complexNested', {
  background: 'white',
});

const SmallButton = theme.variant('small', true)(Button);

const Container = theme.connect(styled.div`
  background: ${selector('background')};
`);

class ComplexNested extends React.Component {
  render() {
    return (
      <Container>
        <Button>A default button for reference</Button>
        <br />
        <SmallButton>Composing</SmallButton>
        <br />
        <Button.Small>Non-composing</Button.Small>
      </Container>
    );
  }
}

ComplexNested.Custom = theme.variant('complexNested')(ComplexNested);

export default ComplexNested;
