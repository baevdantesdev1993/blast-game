import {Application, Text} from "pixi.js";
import {state} from "../index";
import {FIELD_PADDING, FIELD_SIZE} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class PointsDisplay implements IBaseComponent {
  private app: Application
  
  constructor(app: Application) {
    this.app = app
  }
  
  render() {
    const text = new Text(`Points: ${state.points}`)
    text.x = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING
    text.y = 20
    return text
  }
}
