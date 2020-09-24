import styled from 'styled-components';

export default styled.div`
  align-items: ${( {alignItems} ) => alignItems};
  display: flex;
  justify-content: ${( {justifyContent} ) => justifyContent};
  margin: ${( {margin} ) => margin};
`;
