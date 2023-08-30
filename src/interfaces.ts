import {BlockColor} from "./utils/blocksMap";

export interface IBaseComponent {
  render: () => Promise<void> | void
  reRender: () => Promise<void> | void
  destroy: () => Promise<void> | void
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

