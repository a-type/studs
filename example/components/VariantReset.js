import React from 'react';
import { DefaultVariant } from '../../src';
import Nested from './Nested';
import Anchor from './Anchor';
import styled from 'styled-components';
import theme from '../theme';

const select = theme
  .register('NestableVariant', values => ({
    background: values.colors.white,
    color: values.colors.black,
  }))
  .addVariant('secondary', values => ({
    background: values.colors.black,
    color: values.colors.white,
  }))
  .createSelector();

const NestableVariant = theme.connect(styled.div`
  background: ${select('background')};
  color: ${select('color')};
  padding-left: 10px;
`);

NestableVariant.Secondary = theme.variant('secondary')(NestableVariant);

export default () => (
  <NestableVariant>
    Outer component: default styling.<br />
    <Anchor>Anchor's default variant</Anchor>
    <NestableVariant.Secondary>
      <Anchor>Secondary variant applied from parent</Anchor>
      <NestableVariant>
        Another layer without specified variant: still secondary styled, from
        parent.<br />
        <Anchor>Anchor is still secondary as well</Anchor>
        <DefaultVariant>
          <NestableVariant>
            Everything's reset!<br />
            <Anchor>Anchor is now default</Anchor>
          </NestableVariant>
        </DefaultVariant>
      </NestableVariant>
    </NestableVariant.Secondary>
  </NestableVariant>
);
