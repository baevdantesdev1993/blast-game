import {Application, Graphics, GraphicsGeometry, Sprite, Text} from "pixi.js";
import {state} from "../index";
import {
  FIELD_PADDING,
  FIELD_SIZE,
  GREEN_COLOR,
  GREY_COLOR,
  PADDING_TOP,
  PROGRESS_BAR_WIDTH,
  WIN_POINTS
} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class PointsDisplay implements IBaseComponent {
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
    this.progressBar.beginFill(fillProgress ? GREEN_COLOR : GREY_COLOR);
    this.progressBar.drawRect(0,
      20,
      fillProgress ? PROGRESS_BAR_WIDTH * ((state.points/WIN_POINTS)) : PROGRESS_BAR_WIDTH,
      20);
    this.progressBar.endFill();
    this.progressBar.x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    this.progressBar.y = PADDING_TOP * 2
    this.app.stage.addChild(this.progressBar)
  }
  
  public render() {
    this.drawProgressBar()
    this.drawProgressBar(true)
    
    this.text = new Text(`Points: ${state.points}/${WIN_POINTS}`)
    this.text.x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    this.text.y = PADDING_TOP
    this.app.stage.addChild(this.text)
  }
}
