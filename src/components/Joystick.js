import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'react-feather';
import styled from 'styled-components';
import Row from './Row';

const Key = styled.div`
  background-color: white;
  margin: 1px;
  border-radius: 5px;
  cursor: pointer;
  :hover {
    opacity: .9;
  }
`;
const JoystickContainer = styled.div`
  margin-top: 10px;
`;

export default function Joystick( { moveToken } ) {
  return (
    <JoystickContainer>
      <Row width="100%" justifyContent="center">
        <Key><ArrowUp size={45} data-testid="arrow-up" onClick={() => moveToken( 'Up' )} /></Key>
      </Row>
      <Row width="100%" justifyContent="center">
        <Key>
          <ArrowLeft size={45} data-testid="arrow-left" onClick={() => moveToken( 'Left' )} />
        </Key>
        <Key>
          <ArrowDown size={45} data-testid="arrow-down" onClick={() => moveToken( 'Down' )} />
        </Key>
        <Key>
          <ArrowRight size={45} data-testid="arrow-right" onClick={() => moveToken( 'Right' )} />
        </Key>
      </Row>
    </JoystickContainer >
  );
}
