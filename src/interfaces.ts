import {BlockColor} from "./utils/blocksMap";
import {Sprite} from "pixi.js";

export interface IBaseComponent {
  render: () => Promise<Sprite>
}

export interface IPosition {
  x: number,
  y: number
}

export interface IBlock {
  color: BlockColor,
  position: IPosition,
}

export interface IStateService {
  blocksQuantity: number
  blocksList: IBlock[]
}

