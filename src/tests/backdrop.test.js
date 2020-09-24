import React from 'react';
import Backdrop from '../components/Backdrop';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

describe( 'Backdrop Block', () => {
  it( 'renders Backdrop', () => {
    const tree = renderer.create(
      <Backdrop />
    ).toJSON();
    expect( tree ).toMatchSnapshot();
  } );
} );