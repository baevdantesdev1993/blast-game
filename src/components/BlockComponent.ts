import blocksMap, {BlockColor} from "../utils/blocksMap";
import {IBaseComponent} from "../interfaces";
import {BLOCK_SIZE} from "../constants";

export default class BlockComponent implements IBaseComponent {
  private readonly block: HTMLImageElement = null
  
  constructor(color: BlockColor) {
    this.block = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.block.src = blocksMap[color]
  }
  
  public render() {
    return this.block
  }
}
