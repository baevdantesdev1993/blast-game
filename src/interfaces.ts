import {BlockColor} from "./utils/blocksMap";

export interface IBaseComponent {
  render: () => HTMLElement
}

export interface IPosition {
  x: number,
  y: number
}

export interface IBlock {
  color: BlockColor,
  position: IPosition,
  id: string,
}

export interface IStateService {
  blocksQuantity: number
  blocksList: IBlock[]
}

