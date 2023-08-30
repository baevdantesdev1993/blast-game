import {Application, Graphics, Text} from "pixi.js";
import {gameModel} from "../index";
import {
  FIELD_PADDING,
  FIELD_SIZE,
  GREY_COLOR,
  MAX_MIXES,
  PADDING_TOP,
  PROGRESS_BAR_WIDTH,
  RED_COLOR
} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class MixesDisplayScene implements IBaseComponent {
  private app: Application
  private text: Text
  private progressBar: Graphics
  
  constructor(app: Application) {
    this.app = app
  }
  
  public destroy() {
    this.text.destroy()
    this.progressBar.destroy()
  }
  
  public reRender() {
    this.destroy()
    this.render()
  }
  
  private drawProgressBar(fillProgress = false) {
    this.progressBar = new Graphics()
    this.progressBar.beginFill(fillProgress ? RED_COLOR : GREY_COLOR);
    this.progressBar.drawRect(0,
      this.app.renderer.height - PADDING_TOP * 4,
      fillProgress ? PROGRESS_BAR_WIDTH * ((gameModel.mixes / MAX_MIXES)) : PROGRESS_BAR_WIDTH,
      20);
    this.progressBar.endFill();
    this.progressBar.x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    this.progressBar.y = PADDING_TOP * 2
    this.app.stage.addChild(this.progressBar)
  }
  
  render() {
    this.drawProgressBar()
    this.drawProgressBar(true)
    this.text = new Text(`Mixes: ${gameModel.mixes}/${MAX_MIXES}`)
    this.text.x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    this.text.y = this.app.renderer.height - PADDING_TOP * 4
    this.app.stage.addChild(this.text)
  }
}
