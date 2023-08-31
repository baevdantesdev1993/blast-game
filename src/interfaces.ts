import {BlockColor} from './utils/blocksMap';

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
  empty: boolean,
  superBoost: boolean
}

export interface IStateService {
  blocksQuantity: number
  blocksList: IBlock[]
}

export interface IBlastResult {
  isChecking: boolean,
  result: IBlock[]
}

