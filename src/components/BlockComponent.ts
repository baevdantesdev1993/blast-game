import blocksMap from "../utils/blocksMap";
import {IBaseComponent, IBlock} from "../interfaces";
import {BLOCK_SIZE, FIELD_PADDING, FIELD_SIZE} from "../constants";
import {Application, Assets, Sprite} from "pixi.js";
import {pointsDisplayInstance, renderApp, renderResult, state, turnsDisplayInstance} from "../index";

export default class BlockComponent implements IBaseComponent {
  private readonly image: HTMLImageElement
  private sprite: Sprite
  public block: IBlock
  private app: Application
  private readonly startX: number
  private readonly startY: number
  
  constructor(block: IBlock, app: Application) {
    this.image = new Image(BLOCK_SIZE, BLOCK_SIZE)
    this.image.src = blocksMap[block.color]
    this.block = block
    this.app = app
    this.startY = (this.app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
    this.startX = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
  }
  
  private async onClick() {
    try {
      const res = await state.onBlockClick(this.block)
      await renderApp(true)
      if (res === 'loss') {
        renderResult(false)
      }
      if (res === 'win') {
        renderResult(true)
      }
    } catch (e) {
    
    } finally {
      state.clearRelatedBlocksList()
      pointsDisplayInstance.reRender()
      turnsDisplayInstance.reRender()
    }
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
  
  public destroy() {
    this.sprite.destroy()
  }
  
  public async reRender() {
    this.destroy()
    await this.render()
  }
  
  public async render() {
    const texture = await Assets.load(this.image.src);
    this.sprite = new Sprite(texture);
    this.sprite.x = this.startX + (this.block.position.x * BLOCK_SIZE)
    this.sprite.y = this.startY + (this.block.position.y * BLOCK_SIZE)
    if (!this.block.empty) {
      this.sprite.eventMode = 'static'
      this.sprite.cursor = 'pointer'
      this.sprite.on('click', this.onClick, this)
      this.sprite.on('pointerover', this.onPointerOver, this)
      this.sprite.on('pointerleave', this.onPointerLeave, this)
      this.sprite.on('mousedown', this.onMouseDown, this)
      this.sprite.on('mouseup', this.onMouseUp, this)
    }
    if (this.block.empty) {
      this.sprite.width = 0
      this.sprite.height = 0
    } else {
      this.sprite.width = BLOCK_SIZE
      this.sprite.height = BLOCK_SIZE
    }
    this.app.stage.addChild(this.sprite)
  }
}
