import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

describe( 'App Block', () => {
  it( 'renders App', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();
    expect( tree ).toMatchSnapshot();
  } );
} );