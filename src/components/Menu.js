import React from 'react';
import { ArrowLeft } from 'react-feather';
import GameTypography from './GameTypography';
import Input from './Input';
import Row from './Row';

export default function Menu( {
  movements,
  handleChangeEditing,
  handleMovementsChange,
  handleSizeChange,
  size
} ) {
  return <div data-testid="menu">
    <GameTypography data-testid="back-to-game" onClick={() => handleChangeEditing( false )}>
      <Row alignItems="center"> <ArrowLeft size={15} /> Game</Row>
    </GameTypography>
    <GameTypography data-testid="edit-start" onClick={() => handleChangeEditing( 'start' )}>
      Edit Start Position
    </GameTypography>
    <GameTypography data-testid="edit-end" onClick={() => handleChangeEditing( 'end' )}>
      Edit End Position
    </GameTypography>
    <GameTypography data-testid="edit-block" onClick={() => handleChangeEditing( 'block' )}>
      Edit Blocks
    </GameTypography>
    <GameTypography data-testid="edit-random" onClick={() => handleChangeEditing( 'random' )}>
      Set Blocks Randomly
    </GameTypography>
    <GameTypography color="white">
      <Input
        min={0} value={movements - 1} onChange={handleMovementsChange}
        label="Movements" type="number" width="50px" />
    </GameTypography>
    <GameTypography color="white">
      <Input
        value={size} onChange={handleSizeChange}
        label="Size" type="number" width="50px" />
    </GameTypography>
  </div>;
}
