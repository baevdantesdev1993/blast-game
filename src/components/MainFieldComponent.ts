import {Application} from "pixi.js";
import FieldComponent from "./FieldComponent";
import BlockComponent from "./BlockComponent";
import state, {StateService} from "../services/StateService";
import {IPosition} from "../interfaces";
import {BLOCK_SIZE, BLOCKS_IN_ROW, FIELD_PADDING, FIELD_SIZE} from "../constants";

export default class MainFieldComponent {
  field: FieldComponent
  blocks: BlockComponent[]
  app: Application
  state: StateService
  
  constructor(field: FieldComponent, blocks: BlockComponent[], app: Application) {
    this.field = field
    this.blocks = blocks
    this.app = app
    this.state = state
  }
  
  async render() {
    const mainFieldSprite = await this.field.render()
    mainFieldSprite.x = this.app.renderer.width / 2;
    mainFieldSprite.y = this.app.renderer.height / 2;
    mainFieldSprite.anchor.x = 0.5;
    mainFieldSprite.anchor.y = 0.5;
    this.app.stage.addChild(mainFieldSprite);
    
    const startX = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    
    const currentPosition: IPosition = {
      x: startX,
      y: (this.app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING,
    }
    
    let index = 1
    
    for (const block of this.blocks) {
      const renderBlock = await block.render();
      renderBlock.x = currentPosition.x
      renderBlock.y = currentPosition.y
      this.app.stage.addChild(renderBlock);
      if (index % BLOCKS_IN_ROW === 0) {
        currentPosition.y += BLOCK_SIZE
        currentPosition.x = startX
      } else {
        currentPosition.x += BLOCK_SIZE
      }
      index++
    }
  }
}
