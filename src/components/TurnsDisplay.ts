import {Application, Text} from "pixi.js";
import {state} from "../index";
import {FIELD_PADDING, FIELD_SIZE, MAX_TURNS, PADDING_TOP} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class TurnsDisplay implements IBaseComponent {
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
  
  render() {
    this.object = new Text(`Turns: ${state.turns}/${MAX_TURNS}`)
    this.object.x = (this.app.renderer.width / 2) + FIELD_SIZE / 2 - FIELD_PADDING
      - this.object.width
    this.object.y = PADDING_TOP
    this.app.stage.addChild(this.object)
    return this.object
  }
}
