import React from 'react';
import styled from 'styled-components';

const Relative = styled.div`
  position: relative;
  width: 0;
  height: 0;
`;
const Backdrop = styled.div`
  align-items: center;
  display:flex;
  flex-direction: column;
  background-color: rgba(0,0,0,.5);
  justify-content: center;
  height: ${( { size } ) => `${( size * 32 )}px`};
  width: ${( { size } ) => `${( size * 32 )}px`};
`;

export default ( { children, size } ) => {
  return <Relative data-testid="backdrop">
    <Backdrop size={size}>
      {children}
    </Backdrop>
  </Relative>;
};
