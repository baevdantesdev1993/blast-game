import {Application} from "pixi.js";
import FieldComponent from "./FieldComponent";
import BlockComponent from "./BlockComponent";
import {BLOCK_SIZE, FIELD_PADDING, FIELD_SIZE} from "../constants";

export default class MainFieldComponent {
  field: FieldComponent
  blocks: BlockComponent[]
  app: Application
  
  constructor(field: FieldComponent,
              blocks: BlockComponent[],
              app: Application) {
    this.field = field
    this.blocks = blocks
    this.app = app
  }
  
  public async render() {
    const mainFieldSprite = await this.field.render()
    mainFieldSprite.x = this.app.renderer.width / 2;
    mainFieldSprite.y = this.app.renderer.height / 2;
    mainFieldSprite.anchor.x = 0.5;
    mainFieldSprite.anchor.y = 0.5;
    this.app.stage.addChild(mainFieldSprite);
    
    const startX = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
    const startY = (this.app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
    
    for (const blockEl of this.blocks) {
      const renderBlock = await blockEl.render();
      renderBlock.x = startX + (blockEl.block.position.x * BLOCK_SIZE)
      renderBlock.y = startY + (blockEl.block.position.y * BLOCK_SIZE)
      this.app.stage.addChild(renderBlock);
    }
  }
}
