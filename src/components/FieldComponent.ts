import {IBaseComponent} from "../interfaces";
import FieldImage from '../assets/field.png'
import {BLOCK_SIZE, FIELD_PADDING, FIELD_SIZE} from "../constants";
import {Application, Assets, Sprite} from "pixi.js";
import {StateService} from "../services/StateService";
import BlockComponent from "./BlockComponent";
import {pointsDisplayInstance, renderApp, renderResult, state, turnsDisplayInstance} from "../index";

export default class FieldComponent implements IBaseComponent {
  private readonly app: Application
  private object: Sprite
  private state: StateService
  private readonly startX: number
  private readonly startY: number
  private blocks: BlockComponent[] = []
  
  public async onBlockClick(block: BlockComponent) {
    try {
      const res = await state.onBlockClick(block.block)
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
  
  constructor(app: Application, state: StateService) {
    this.app = app
    this.state = state
    this.startY = (this.app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
    this.startX = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
  }
  
  public destroy() {
    this.blocks.forEach((b) => b.destroy())
    this.blocks = []
  }
  
  public async reRender() {
    this.destroy()
    await this.renderBlocks()
  }
  
  private renderBlocks() {
    this.state.blocksList.forEach(async (item) => {
      const component = new BlockComponent(item, this.app, this.onBlockClick)
      await component.render()
      this.blocks.push(component)
    })
  }
  
  public async render() {
    const image = new Image(FIELD_SIZE, FIELD_SIZE)
    image.src = FieldImage
    const texture = await Assets.load(image.src);
    this.object = new Sprite(texture);
    this.object.width = FIELD_SIZE
    this.object.height = FIELD_SIZE
    
    this.object.x = this.app.renderer.width / 2;
    this.object.y = this.app.renderer.height / 2;
    this.object.anchor.x = 0.5;
    this.object.anchor.y = 0.5;
    this.app.stage.addChild(this.object);
    
    this.renderBlocks()
  }
}
