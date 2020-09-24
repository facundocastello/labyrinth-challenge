import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  align-items:row;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const Input = styled.input`
  width: ${( { width } ) => width}
`;

export default ( { min, max, value, onChange, label, type, width } ) => {
  return <InputContainer width={width}>
    <div>{label}:</div>
    <Input
      data-testid={label} min={min} max={max}
      value={value} type={type} onChange={onChange}
      width={width} />
  </InputContainer>;
};
