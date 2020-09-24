import React from 'react';
import Board from '../components/Board';
import { create } from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import 'jest-styled-components';

const renderBoard = ( size, blockedPositions, startPosition, endPosition ) => {
  const { getByTestId } = render( <Board
    startPosition={startPosition} endPosition={endPosition} blockedPositions={blockedPositions}
    size={size} /> );
  for ( let index = 0; index < size * size; index++ ) {
    const slot = getByTestId( `slot-${index}` );
    let type = 'empty';
    if ( index === endPosition ) { type = 'end'; } else
    if ( index === startPosition ) { type = 'start'; } else
    if ( blockedPositions.includes( index )) type = 'blocked';
    expect( slot ).toHaveAttribute( 'type', type );
  }
};

describe( 'Board Block', () => {
  it( 'renders Board', () => {
    const tree = create(
      <Board blockedPositions={[]} size={5} />
    ).toJSON();
    expect( tree ).toMatchSnapshot();
  } );

  it( 'renders 5x5 board with 1 blocked', () => {
    const size = 5;
    const blockedPositions = [1];
    const startPosition = 0;
    const endPosition = 5;
    renderBoard( size, blockedPositions, startPosition, endPosition );
  } );

  it( 'render 5x5 board with 1 blocked and click on first slot', () => {
    const size = 5;
    const blockedPositions = [1];
    const startPosition = 0;
    const endPosition = 5;
    const index = 5;
    const sortClicked = jest.fn();
    const { getByTestId } = render( <Board
      slotClicked={sortClicked} startPosition={startPosition} endPosition={endPosition}
      blockedPositions={blockedPositions} size={size} /> );
    fireEvent.click( getByTestId( `slot-${index}` ));
    expect( sortClicked ).toHaveBeenCalledWith( index );
  } );

  it( 'renders 20x20 board with 10 blocked', () => {
    const size = 20;
    const blockedPositions = [1, 2, 3, 4, 6, 7, 8, 9, 90];
    const startPosition = 0;
    const endPosition = 5;
    renderBoard( size, blockedPositions, startPosition, endPosition );
  } );

  it( 'renders board with the message You Lose', () => {
    const size = 5;
    const blockedPositions = [];
    const startPosition = 0;
    const endPosition = 5;
    const { getByText } = render( <Board
      lost={true}
      startPosition={startPosition} endPosition={endPosition} blockedPositions={blockedPositions}
      size={size} /> );
    expect( getByText( 'You Lose' )).not.toBeNull();
    expect( getByText( 'Play again' )).not.toBeNull();
  } );

  it( 'renders board with the message You Win and the time', () => {
    const size = 5;
    const blockedPositions = [];
    const startPosition = 0;
    const endPosition = 5;
    const time = 5;
    const { getByText } = render( <Board
      win={true} time={time}
      startPosition={startPosition} endPosition={endPosition} blockedPositions={blockedPositions}
      size={size} /> );
    expect( getByText( 'You Win' )).not.toBeNull();
    expect( getByText( `Your Time: ${time}s` )).not.toBeNull();
    expect( getByText( 'Next level' )).not.toBeNull();
  } );
} );