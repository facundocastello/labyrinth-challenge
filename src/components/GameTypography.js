import styled from 'styled-components';

export default styled.div`
  color: ${( {color, win, lost} ) => color || ( win ? '#85EB85': lost ? 'red':'#FFFF07' )};
  cursor: ${( {onClick} ) => onClick && 'pointer'};
  margin: 10px;
`;