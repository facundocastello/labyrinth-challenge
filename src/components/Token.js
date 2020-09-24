import React from 'react';
import { User, UserCheck, UserX } from 'react-feather';
import styled from 'styled-components';

const TokenContainer = styled.div`
  position: relative;
  top: ${( { top } ) => `${( 32 * ( top || 0 )) + 5}px`};
  left: ${( { left } ) => `${( 32 * ( left || 0 )) + 5}px`};
  width: 0;
  height: 0;
  transition: top .1s, left .1s;
`;

const BlackDot = styled.div`
  @keyframes heartbeat
  {
    0%
    {
      transform: scale( .9 );
    }
    50%
    {
      transform: scale( 1 );
    }
    100%
    {
      transform: scale( .9 );
    }
  }
  width:24px;
  height:24px;
  animation: ${( {lost} ) => !lost && 'heartbeat 1s infinite'};
`;

export default ( { left, top, win, lost } ) => <TokenContainer
  data-testid="token" left={left} top={top}>
  <BlackDot lost={lost}>
    {win ? <UserCheck />: lost ? <UserX /> : <User/>}
  </BlackDot>
</TokenContainer>;