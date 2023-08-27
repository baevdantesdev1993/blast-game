import blocksMap, {BlockColor} from "../utils/blocksMap";
import {IBaseComponent} from "../interfaces";
import {BLOCK_SIZE, FIELD_SIZE} from "../constants";
import {Assets, Sprite} from "pixi.js";

export default class BlockComponent implements IBaseComponent {
  private readonly image: HTMLImageElement = null
  
  constructor(color: BlockColor) {
    this.image = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.image.src = blocksMap[color]
  }
  
  public async render() {
    const texture = await Assets.load(this.image.src);
    const sprite = new Sprite(texture);
    sprite.width = BLOCK_SIZE
    sprite.height = BLOCK_SIZE
    return sprite
  }
}
