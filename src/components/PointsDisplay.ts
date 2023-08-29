import {Application, Container, Text} from "pixi.js";
import {state} from "../index";
import {FIELD_PADDING, FIELD_SIZE, PADDING_TOP, WIN_POINTS} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class PointsDisplay implements IBaseComponent {
  private app: Application
  private object: Text
  
  constructor(app: Application) {
    this.app = app
  }
  
  public destroy() {
    this.object.destroy()
  }
  
  public reRender() {
    this.destroy()
    this.render()
  }
  
  public render() {
    this.object = new Text(`Points: ${state.points}/${WIN_POINTS}`)
    this.object .x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    this.object .y = PADDING_TOP
    this.app.stage.addChild(this.object)
    return this.object
  }
}
