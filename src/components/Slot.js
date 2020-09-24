import styled from 'styled-components';

const typeStyles = {
  'end': '#85EB85',
  'start': '#FFFF07',
  'blocked': 'lightgray',
  'empty': 'white'
};

export default styled.div`
  width:30px;
  height:30px;
  border: 1px solid black;
  background-color: ${( {type} ) => typeStyles[type] }
`;