import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { maxSize } from '../utils/constants';
import Backdrop from './Backdrop';
import GameTypography from './GameTypography';
import Slot from './Slot';

const Horizontal = styled.div`
  display: flex;
`;

const Vertical = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardContainer = styled.div`
  border: 1px solid black;
  width: fit-content;
`;

export default function Board( {
  editting, blockedPositions, endPosition, startPosition,
  size, slotClicked, handleEndGame, win, lost, time
} ) {
  const [boardItems, setBoardItems] = useState([]);

  useEffect(() => {
    var newBoardItems = new Array( size );
    for ( let x = 0; x < size; x++ ) {
      newBoardItems[x] = new Array( size );
      for ( let y = 0; y < size; y++ ) {
        if (( x * size + y ) === endPosition ) {
          newBoardItems[x][y] = 'end';
          continue;
        }
        if (( x * size + y ) === startPosition ) {
          newBoardItems[x][y] = 'start';
          continue;
        }
        const isBlocked = blockedPositions.find(( blockedPosition ) =>
          ( x * size + y ) === blockedPosition ) > -1;

        if ( isBlocked ) {
          newBoardItems[x][y] = 'blocked';
          continue;
        }
        newBoardItems[x][y] = 'empty';
      }
    }
    setBoardItems( newBoardItems );

  }, [blockedPositions, endPosition, size, startPosition]);

  const truncate = ( str, length ) =>
    str.length > length ? str.substring( 0, length ) + '...' : str;

  return <BoardContainer data-testid="board">
    {!editting && ( win || lost ) &&
      <Backdrop size={size}>
        <GameTypography win={win} lost={lost}>
          {win ? ( size === maxSize ? 'Game Over' : 'You Win' ) : lost ? 'You Lose' : ''}
        </GameTypography>
        {win && <GameTypography win={win} lost={lost}>
          Your Time: {truncate(( time ) + '' )}s
        </GameTypography>}
        <GameTypography data-testid="end-game" onClick={handleEndGame}>
          {win ? ( size === maxSize ? '' : 'Next level' ) : lost ? 'Play again' : ''}
        </GameTypography>
      </Backdrop>
    }
    <Vertical>
      {boardItems.map(( row, index ) => <Horizontal key={`row-${index}`}>
        {row && row.map(( slot, slotIndex ) => <Slot
          data-testid={`slot-${index * size + slotIndex}`}
          onClick={() => slotClicked( size * index + slotIndex )}
          type={slot} key={`slot-${index}-${slotIndex}`} /> )}
      </Horizontal>
      )}
    </Vertical>
  </BoardContainer>;
}
