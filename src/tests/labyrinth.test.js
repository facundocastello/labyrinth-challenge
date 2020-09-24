import React from 'react';
import Labyrinth from '../pages/Labyrinth';
import { create } from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import 'jest-styled-components';
import { initSize, maxSize } from '../utils/constants';

const getBlocks = ( getByTestId, size ) => {
  const blocks = [];
  for ( let index = 0; index < size * size; index++ ) {
    const slot = getByTestId( `slot-${index}` );
    if ( slot.getAttribute( 'type' ) === 'blocked' ) blocks.push( index );
  }
  return blocks;
};

const selectMenuOption = ( getByTestId, id ) => {
  const settingsIcon = getByTestId( 'settings-icon' );
  fireEvent.click( settingsIcon );
  const action = getByTestId( id );
  fireEvent.click( action );
};

const cleanBlocks = ( getByTestId, size ) => {
  const blockedPositions = getBlocks( getByTestId, size );
  selectMenuOption( getByTestId, 'edit-block' );
  blockedPositions.forEach( blockPosition => {
    const slot = getByTestId( `slot-${blockPosition}` );
    fireEvent.click( slot );
  } );
};

describe( 'Labyrinth Block', () => {
  it( 'renders Labyrinth', () => {
    const tree = create( <Labyrinth /> ).toJSON();
    expect( tree ).toMatchSnapshot();
  } );

  it( 'removes blocks and expect to have blocksPositions empty', () => {
    const { getByTestId } = render( <Labyrinth /> );
    cleanBlocks( getByTestId, initSize );
    const blocks = [];
    for ( let index = 0; index < initSize * initSize; index++ ) {
      const slot = getByTestId( `slot-${index}` );
      if ( slot.getAttribute( 'type' ) === 'blocked' ) blocks.push( slot );
    }
    expect( blocks.length ).toBe( 0 );
  } );

  it( 'removes blocks, go to end and expect to see the you win message', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    cleanBlocks( getByTestId, initSize );
    fireEvent.click( getByTestId( 'back-to-menu' ));
    fireEvent.click( getByTestId( 'back-to-game' ));
    const rightKey = getByTestId( 'arrow-right' );
    const downKey = getByTestId( 'arrow-down' );
    for ( let index = 0; index < 4; index++ ) {
      fireEvent.click( rightKey );
      fireEvent.click( downKey );
    }
    expect( queryByText( 'You Win' )).not.toBeNull();
    const endGameButton = getByTestId( 'end-game' );
    fireEvent.click( endGameButton );
    expect( queryByText( 'You Win' )).toBeNull();
  } );

  it( 'removes blocks, move until you lose and expect to see the  you lose message', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    cleanBlocks( getByTestId, initSize );
    fireEvent.click( getByTestId( 'back-to-menu' ));
    fireEvent.click( getByTestId( 'back-to-game' ));
    const leftKey = getByTestId( 'arrow-left' );
    const upKey = getByTestId( 'arrow-up' );
    const rightKey = getByTestId( 'arrow-right' );
    const downKey = getByTestId( 'arrow-down' );
    for ( let index = 0; index < 3; index++ ) {
      fireEvent.click( leftKey );
      fireEvent.click( upKey );
      fireEvent.click( rightKey );
      fireEvent.click( downKey );
    }
    expect( queryByText( 'You Lose' )).not.toBeNull();
    const endGameButton = getByTestId( 'end-game' );
    fireEvent.click( endGameButton );
    expect( queryByText( 'You Lose' )).toBeNull();
  } );

  it( 'changes start position and check that blocks update', () => {
    const { getByTestId } = render( <Labyrinth /> );
    selectMenuOption( getByTestId, 'edit-start' );
    const slot = getByTestId( 'slot-1' );
    expect( slot.getAttribute( 'type' )).not.toBe( 'start' );
    fireEvent.click( slot );
    fireEvent.click( getByTestId( 'back-to-menu' ));
    fireEvent.click( getByTestId( 'back-to-game' ));
    expect( slot.getAttribute( 'type' )).toBe( 'start' );
  } );

  it( 'changes end position and check that blocks update', () => {
    const { getByTestId } = render( <Labyrinth /> );
    selectMenuOption( getByTestId, 'edit-end' );
    const slot = getByTestId( 'slot-2' );
    expect( slot.getAttribute( 'type' )).not.toBe( 'end' );
    fireEvent.click( slot );
    expect( slot.getAttribute( 'type' )).toBe( 'end' );
  } );

  it( 'gets "Moves Left", move token and expect "Moves Left" to be reduced by 1 and token to change position ', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    expect( queryByText( 'Moves Left 8' )).not.toBeNull();
    const slotRight = getByTestId( 'slot-1' );
    let key = slotRight.getAttribute( 'type' ) === 'blocked' ? 'down' : 'right';
    const keyButton = getByTestId( `arrow-${key}` );
    fireEvent.click( keyButton );
    expect( queryByText( 'Moves Left 7' )).not.toBeNull();
    const token = getByTestId( 'token' );
    expect( token ).toHaveStyleRule( key === 'down' ? 'top':'left', '37px' );
  } );

  it( 'goes to menu and goes back to game', () => {
    const { getByTestId } = render( <Labyrinth /> );
    selectMenuOption( getByTestId, 'back-to-game' );
    expect( getByTestId( 'board' )).not.toBeNull();
  } );

  it( 'changes movements and check that "Moves Left change"', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    const settingsIcon = getByTestId( 'settings-icon' );
    fireEvent.click( settingsIcon );
    const movements = getByTestId( 'Movements' );
    fireEvent.change( movements, { target: { value: 20 } } );
    const goBack = getByTestId( 'back-to-game' );
    fireEvent.click( goBack );
    expect( queryByText( 'Moves Left 20' )).not.toBeNull();
  } );

  it( 'changes size to be the max, win the game and expect the message to be Game Over ', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    const settingsIcon = getByTestId( 'settings-icon' );
    fireEvent.click( settingsIcon );
    const size = getByTestId( 'Size' );
    fireEvent.change( size, { target: { value: maxSize } } );
    fireEvent.click(getByTestId( 'edit-end' ));
    fireEvent.click(getByTestId( 'slot-1' ));
    fireEvent.click( getByTestId( 'back-to-menu' ));
    fireEvent.click( getByTestId( 'back-to-game' ));
    fireEvent.click( getByTestId( 'arrow-right' ) );
    expect( queryByText( 'Game Over' )).not.toBeNull();
  } );

  it( 'triggers undo and check that "Moves Left" changes', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    expect( queryByText( 'Moves Left 8' )).not.toBeNull();
    const slotRight = getByTestId( 'slot-1' );
    let key = slotRight.getAttribute( 'type' ) === 'blocked' ? 'down' : 'right';
    const keyButton = getByTestId( `arrow-${key}` );
    fireEvent.click( keyButton );
    expect( queryByText( 'Moves Left 7' )).not.toBeNull();
    const undoButton = getByTestId( 'undo-icon' );
    fireEvent.click( undoButton );
    expect( queryByText( 'Moves Left 8' )).not.toBeNull();
  } );

  it( 'triggers reload and check that "Moves Left" changes', () => {
    const { getByTestId, queryByText } = render( <Labyrinth /> );
    expect( queryByText( 'Moves Left 8' )).not.toBeNull();
    const slotRight = getByTestId( 'slot-1' );
    let key = slotRight.getAttribute( 'type' ) === 'blocked' ? 'down' : 'right';
    const keyButton = getByTestId( `arrow-${key}` );
    fireEvent.click( keyButton );
    expect( queryByText( 'Moves Left 7' )).not.toBeNull();
    const undoButton = getByTestId( 'reload-icon' );
    fireEvent.click( undoButton );
    expect( queryByText( 'Moves Left 8' )).not.toBeNull();
  } );
} );
