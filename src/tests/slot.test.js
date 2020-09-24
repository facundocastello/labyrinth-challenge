import React from 'react';
import Slot from '../components/Slot';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

describe( 'Slot Block', () => {
  it( 'renders Slot', () => {
    const tree = renderer.create(
      <Slot />
    ).toJSON();
    expect( tree ).toMatchSnapshot();
  } );
} );