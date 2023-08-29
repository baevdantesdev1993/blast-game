import {Application, Graphics, Text} from "pixi.js";
import {state} from "../index";
import {
  FIELD_PADDING,
  FIELD_SIZE,
  GREY_COLOR,
  MAX_TURNS,
  PADDING_TOP,
  PROGRESS_BAR_WIDTH,
  RED_COLOR
} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class TurnsDisplay implements IBaseComponent {
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
      20,
      fillProgress ? PROGRESS_BAR_WIDTH * ((state.turns / MAX_TURNS)) : PROGRESS_BAR_WIDTH,
      20);
    this.progressBar.endFill();
    this.progressBar.x =
      fillProgress ?
        (this.app.renderer.width / 2) + FIELD_SIZE / 2 - FIELD_PADDING - PROGRESS_BAR_WIDTH :
        (this.app.renderer.width / 2) + FIELD_SIZE / 2 - FIELD_PADDING - this.progressBar.width
    this.progressBar.y = PADDING_TOP * 2
    this.app.stage.addChild(this.progressBar)
  }
  
  render() {
    this.drawProgressBar()
    this.drawProgressBar(true)
    this.text = new Text(`Turns: ${state.turns}/${MAX_TURNS}`)
    this.text.x = (this.app.renderer.width / 2) + FIELD_SIZE / 2 - FIELD_PADDING
      - this.text.width
    this.text.y = PADDING_TOP
    this.app.stage.addChild(this.text)
  }
}
