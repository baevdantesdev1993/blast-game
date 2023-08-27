import {Application} from "pixi.js";
import FieldComponent from "./FieldComponent";
import BlockComponent from "./BlockComponent";
import state from "../services/StateService";

export default class MainFieldComponent {
  field: FieldComponent
  blocks: BlockComponent[]
  app: Application
  
  constructor(field: FieldComponent, blocks: BlockComponent[], app: Application) {
    this.field = field
    this.blocks = blocks
    this.app = app
  }
  
  async render() {
    const mainFieldSprite = await this.field.render()
    mainFieldSprite.x = this.app.renderer.width / 2;
    mainFieldSprite.y = this.app.renderer.height / 2;
    mainFieldSprite.anchor.x = 0.5;
    mainFieldSprite.anchor.y = 0.5;
    this.app.stage.addChild(mainFieldSprite);
    
    const firstBlock = this.blocks[0]
    
    firstBlock.x = this.app.renderer.width / 2;
    blockSprite.y = this.app.renderer.height / 2;
    blockSprite.anchor.x = 0.5;
    blockSprite.anchor.y = 0.5;
    
    this.app.stage.addChild(blockSprite);
  }
}
