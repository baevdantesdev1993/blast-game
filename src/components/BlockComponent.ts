import blocksMap from "../utils/blocksMap";
import {IBaseComponent, IBlock} from "../interfaces";
import {BLOCK_SIZE} from "../constants";
import {Assets, Sprite} from "pixi.js";
import {StateService} from "../services/StateService";

export default class BlockComponent implements IBaseComponent {
  private readonly image: HTMLImageElement
  private sprite: Sprite
  private state: StateService
  private readonly block: IBlock
  
  constructor(block: IBlock, state: StateService) {
    this.image = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.image.src = blocksMap[block.color]
    this.block = block
    this.state = state
  }
  
  private onClick() {
    console.log(this)
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
    this.sprite.on('click', this.onClick, this.block)
    this.sprite.on('pointerover', this.onPointerOver, this)
    this.sprite.on('pointerleave', this.onPointerLeave, this)
    this.sprite.width = BLOCK_SIZE
    this.sprite.height = BLOCK_SIZE
    return this.sprite
  }
}
