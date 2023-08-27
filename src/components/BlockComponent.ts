import blocksMap, {BlockColor} from "../utils/blocksMap";
import {IBaseComponent} from "../interfaces";
import {BLOCK_SIZE} from "../constants";
import {Assets, Sprite} from "pixi.js";

export default class BlockComponent implements IBaseComponent {
  private readonly image: HTMLImageElement = null
  private sprite: Sprite = null
  
  constructor(color: BlockColor) {
    this.image = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.image.src = blocksMap[color]
  }
  
  private onClick() {
    console.log('click')
  }
  
  public async render() {
    const texture = await Assets.load(this.image.src);
    this.sprite = new Sprite(texture);
    this.sprite.width = BLOCK_SIZE
    this.sprite.height = BLOCK_SIZE
    return this.sprite
  }
}
