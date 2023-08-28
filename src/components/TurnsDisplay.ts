import {Application, Text} from "pixi.js";
import {state} from "../index";
import {FIELD_PADDING, FIELD_SIZE} from "../constants";
import {IBaseComponent} from "../interfaces";

export default class TurnsDisplay implements IBaseComponent {
  private app: Application
  
  constructor(app: Application) {
    this.app = app
  }
  
  render() {
    const text = new Text(`Turns: ${state.turns}`)
    text.x = (this.app.renderer.width / 2) + FIELD_SIZE / 2 - FIELD_PADDING - text.width
    text.y = 20
    return text
  }
}
