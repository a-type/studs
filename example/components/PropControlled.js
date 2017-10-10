import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import Button from './Button';

const selector = theme
  .register('PropControlled', theme => ({
    on: 'red',
    off: 'white',
  }))
  .createSelector();

const Toggled = theme.connect(
  styled.div`
    background: ${props =>
      props.on ? selector('on')(props) : selector('off')(props)};
    width: 60px;
    height: 60px;
  `,
  { pure: false },
);

class PropControlled extends React.Component {
  state = {
    on: false,
  };

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ on: !this.state.on });
          }}
        >
          toggle
        </button>
        <Toggled on={this.state.on} />
      </div>
    );
  }
}

export default PropControlled;
