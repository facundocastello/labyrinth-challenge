import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Labyrinth from './pages/Labyrinth';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #446e9b;
  }
`

function App() {
  return <>
    <GlobalStyle />
    <Labyrinth />
  </>
}

export default App;
