import blocksMap from "../utils/blocksMap";
import {IBaseComponent, IBlock} from "../interfaces";
import {BLOCK_SIZE} from "../constants";
import {Assets, Sprite} from "pixi.js";
import {state} from "../index";

export default class BlockComponent implements IBaseComponent {
  private readonly image: HTMLImageElement
  private sprite: Sprite
  public block: IBlock
  
  constructor(block: IBlock) {
    this.image = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.image.src = blocksMap[block.color]
    this.block = block
  }
  
  private onClick() {
    state.onClickBlock(this.block)
  }
  
  private onMouseDown() {
    this.sprite.alpha = 0.5
  }
  
  private onMouseUp() {
    this.sprite.alpha = 0.8
  }
  
  private onPointerOver() {
    this.sprite.alpha = 0.8
  }
  
  private onPointerLeave() {
    this.sprite.alpha = 1
  }
  
  public async render() {
    const texture = await Assets.load(this.image.src);
    this.sprite = new Sprite(texture);
    this.sprite.eventMode = 'static'
    this.sprite.cursor = 'pointer'
    this.sprite.on('click', this.onClick, this)
    this.sprite.on('pointerover', this.onPointerOver, this)
    this.sprite.on('pointerleave', this.onPointerLeave, this)
    this.sprite.on('mousedown', this.onMouseDown, this)
    this.sprite.on('mouseup', this.onMouseUp, this)
    this.sprite.width = BLOCK_SIZE
    this.sprite.height = BLOCK_SIZE
    return this.sprite
  }
}
