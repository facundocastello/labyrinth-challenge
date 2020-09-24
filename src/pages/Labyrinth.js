import React, { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, CornerUpLeft, RefreshCw, Settings } from 'react-feather';
import Board from '../components/Board'
import Container from '../components/Container';
import GameTypography from '../components/GameTypography';
import Joystick from '../components/Joystick';
import Menu from '../components/Menu';
import Row from '../components/Row';
import Token from '../components/Token';
import { initEndPosition, initStartPosition, initSize, maxSize } from '../utils/constants';

export default function Labyrinth() {
  const [edittingStatus, setEdittingStatus] = useState(false);
  const [blockedPositions, setBlockedPositions] = useState([]);
  const [size, setSize] = useState(initSize);
  const [endPosition, setEndPosition] = useState(initEndPosition);
  const [startPosition, setStartPosition] = useState(initStartPosition);
  const [tokenPositions, setTokenPositions] = useState([startPosition]);
  const [limitMovements, setLimitMovements] = useState((2 * initSize) - 1);
  const [time, setTime] = useState(undefined);

  useEffect(() => {
    if (tokenPositions.length > 1 && !time) {
      setTime(new Date());
    } else if (endPosition === tokenPositions[0] && typeof time !== 'number') {
      setTime((new Date() - time) / 1000)
    }
  }, [endPosition, time, tokenPositions])

  useEffect(() => {
    if (tokenPositions.length === 1) setTime(undefined)
  }, [tokenPositions.length])

  const generatePath = useCallback((start, end, size) => {
    const path = [start];
    const xEnd = end % size
    const yEnd = Math.floor(end / size)
    const orientation = Math.random();
    while (path[path.length - 1] !== end) {
      let newBlock = path[path.length - 1];
      const xNewBlock = newBlock % size;
      const yNewBlock = Math.floor(newBlock / size);
      if (xEnd !== xNewBlock && (Math.random() > orientation || yNewBlock === yEnd)) {
        if (xNewBlock < xEnd) path.push(newBlock + 1)
        if (xNewBlock > xEnd) path.push(newBlock - 1)
      } else {
        if (yNewBlock < yEnd) path.push(newBlock + 1 * size)
        if (yNewBlock > yEnd) path.push(newBlock - 1 * size)
      }
    }
    return path;
  }, [])

  const setRandomBlocks = useCallback((startPosition, endPosition, size) => {
    const maxBlock = size * size;
    const happyPath = generatePath(startPosition, endPosition, size);
    setLimitMovements(happyPath.length)
    let falsePaths = [];
    for (let index = 0; index < Math.floor(size / 4); index++) {
      const start = happyPath[Math.round(Math.random() * (happyPath.length - 1))]
      const end = Math.round(Math.random() * maxBlock);
      falsePaths = [...falsePaths, ...generatePath(start, end, size)];
    }

    const newBlockedPositions = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const position = x * size + y;
        if (!happyPath.includes(position) && !falsePaths.includes(position))
          newBlockedPositions.push(position);
      }
    }
    setBlockedPositions(newBlockedPositions)
    setTokenPositions([startPosition]);
  }, [generatePath])

  const scalarBaseChange = useCallback((position, oldScalar, newScalar) => {
    const x = position % oldScalar;
    const y = Math.floor(position / oldScalar);
    const newX = Math.round((x - oldScalar / 2) * newScalar / oldScalar + (newScalar/2));
    const newY = Math.round((y - oldScalar / 2) * newScalar / oldScalar + (newScalar/2));

    debugger;
    return newX + newY * newScalar;
  },[])

  const changeSize = useCallback((ev) => {
    const newSize = ev.target ? ev.target.value * 1 : ev;
    if (newSize > maxSize || newSize < initSize) return
    const newStartPosition = scalarBaseChange(startPosition, size, newSize);
    const newEndPosition = scalarBaseChange(endPosition, size, newSize);
    setSize(newSize);
    setEndPosition(newEndPosition);
    setTokenPositions([newStartPosition])
    setStartPosition(newStartPosition);
    setLimitMovements(Math.floor(2.5 * newSize));
    setRandomBlocks(newStartPosition, newEndPosition, newSize);
  }, [endPosition, scalarBaseChange, setRandomBlocks, size, startPosition]);

  const handleLimitMovementsChange = (ev) => {
    setLimitMovements(ev.target.value * 1 + 1);
  }

  useEffect(() => {
    setRandomBlocks(initStartPosition, initSize * initSize - 1, initSize);
  }, [setRandomBlocks])

  const handleSetRandom = useCallback(() => {
    setRandomBlocks(startPosition, endPosition, size);
  }, [endPosition, setRandomBlocks, size, startPosition])

  const handleSlotClicked = (position) => {
    switch (edittingStatus) {
      case 'block':
        const newBlockedPositions = [...blockedPositions];
        const blockIndex = newBlockedPositions.indexOf(position);
        if (blockIndex === -1) {
          newBlockedPositions.push(position);
        } else {
          newBlockedPositions.splice(blockIndex, 1);
        }
        setBlockedPositions(newBlockedPositions)
        break;
      case 'start':
        if (position === endPosition) return;
        setStartPosition(position);
        setRandomBlocks(position, endPosition, size);
        break;
      case 'end':
        if (position === startPosition) return;
        setEndPosition(position);
        setRandomBlocks(startPosition, position, size);
        break;
      default:
        break;
    }
  }

  const undoMovement = useCallback(() => {
    if (tokenPositions.length === 1) return
    setTokenPositions([...tokenPositions.slice(1)]);
  }, [tokenPositions])

  const handleEndGame = useCallback(() => {
    if (endPosition === tokenPositions[0]) {
      return changeSize(size + 1)
    } else if (limitMovements - tokenPositions.length === 0) {
      setTokenPositions([startPosition])
    }
  }, [changeSize, endPosition, limitMovements, size, startPosition, tokenPositions])

  const moveToken = useCallback((direction) => {
    let newPosition = tokenPositions[0];
    switch (direction) {
      case 'Up':
        if (tokenPositions[0] - size >= 0) newPosition -= size;
        break;
      case 'Down':
        if ((tokenPositions[0] + size) / size < size) newPosition += size;
        break;
      case 'Left':
        if ((tokenPositions[0] % size - 1) >= 0) newPosition -= 1;
        break;
      case 'Right':
        if (((tokenPositions[0] % size) + 1) < size) newPosition += 1;
        break;
      default:
        return;
    }
    if ((limitMovements - tokenPositions.length) > 0
      && endPosition !== tokenPositions[0]
      && newPosition !== tokenPositions[0]
      && !blockedPositions.includes(newPosition)) {
      const newTokenPositions = [...tokenPositions];
      newTokenPositions.unshift(newPosition);
      setTokenPositions(newTokenPositions);
    }
  }, [blockedPositions, endPosition, limitMovements, size, tokenPositions])

  const handleKeyDown = useCallback((event) => {
    const { key, path } = event;
    if ( path[0]?.toString()?.includes('Input') || edittingStatus !== false) return;
    if (key.includes('Arrow')) return moveToken(key.slice(5));
    switch (key) {
      case 'Backspace':
        undoMovement();
        break;
      case ' ':
        handleEndGame();
        break;
      case 'r':
        setTokenPositions([startPosition]);
        break;
      case 'R':
        setTokenPositions([startPosition]);
        break;
      default:
        return;
    }
  }, [edittingStatus, handleEndGame, moveToken, startPosition, undoMovement]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown])

  const handleChangeEditing = useCallback((type) => {
    if (edittingStatus !== type) return setEdittingStatus(type);
    setEdittingStatus(false);
    setTokenPositions([startPosition]);
  }, [edittingStatus, startPosition])

  const win = endPosition === tokenPositions[0];
  const lost = limitMovements - tokenPositions.length <= 0;
  const leftMoves = limitMovements - tokenPositions.length;
  return <Container>
    {edittingStatus !== true &&
      <div>
        {!edittingStatus ?
          <>
            <Row justifyContent='flex-end'>
              <CornerUpLeft cursor='pointer' data-testid='undo-icon' color='#FFFF07'
                onClick={undoMovement} />
              <RefreshCw cursor='pointer' data-testid='reload-icon' color='#FFFF07'
                onClick={() => setTokenPositions([startPosition])} />
              <Settings cursor='pointer' data-testid='settings-icon' color='#FFFF07'
                onClick={() => handleChangeEditing(true)} />
            </Row>
            <Token win={win} lost={lost} left={tokenPositions[0] % size}
              top={Math.floor(tokenPositions[0] / size)} />
          </>
          :
          <GameTypography data-testid='back-to-menu' onClick={() => handleChangeEditing(true)}>
            <Row alignItems='center'><ArrowLeft size={15} /> Menu </Row>
          </GameTypography>
        }
        <Board editting={edittingStatus} handleEndGame={handleEndGame} win={win} lost={lost} time={time}
          blockedPositions={blockedPositions} endPosition={endPosition} size={size}
          startPosition={startPosition} slotClicked={handleSlotClicked}></Board>
        {edittingStatus === 'random' &&
          <Row justifyContent='center'><RefreshCw data-testid='random-icon' color='#FFFF07' onClick={handleSetRandom} /></Row>
        }
        {!edittingStatus &&
          <div>
            <GameTypography color='white'>Moves Left {leftMoves < 0 ? 0 : leftMoves}</GameTypography>
            <Joystick moveToken={moveToken} />
          </div>
        }
      </div>
    }
    {edittingStatus === true &&
      <Menu handleMovementsChange={handleLimitMovementsChange} size={size} handleSizeChange={changeSize}
        movements={limitMovements} handleChangeEditing={handleChangeEditing} edittingStatus={edittingStatus} />}
  </Container>
}
