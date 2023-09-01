import {BlockColor} from './utils/blocksMap';
import {GameStatus} from './types';

export interface IBaseComponent {
  render: (arg: never) => void
  reRender: (arg: never) => void
  destroy: () => void
}

export interface IPosition {
  x: number,
  y: number
}

export interface IBlock {
  color: BlockColor,
  position: IPosition,
  superBoost: boolean
}

export interface IBlastResult {
  isChecking: boolean,
  result: IBlock[]
}

export interface IRemoveStage {
  removedBlocks: IBlock[],
}

export interface IMoveBlock {
  block: IBlock,
  target: IPosition
}

export interface IMoveStage {
  movedBlocks: IMoveBlock[]
}

export interface IAddStage {
  addedBlocks: IBlock[]
}

export interface ITurnResult {
  gameStatus: GameStatus,
  blocksList: IBlock[],
  success: boolean,
  stages: {
    remove: IRemoveStage,
    move: IMoveStage,
    add: IAddStage
  }
}

