import React from 'react';
import Container from '../components/Container';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

describe( 'Container Block', () => {
  it( 'renders Container', () => {
    const tree = renderer.create(<Container />).toJSON();
    expect( tree ).toMatchSnapshot();
  } );
} );