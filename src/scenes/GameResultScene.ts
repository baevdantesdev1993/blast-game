import {IBaseComponent} from "../interfaces";
import {Application, Text, TextStyle} from "pixi.js";
import {GREEN_COLOR, PADDING_TOP, RED_COLOR} from "../constants";

export default class GameResultScene implements IBaseComponent {
  private app: Application
  private text: Text
  
  constructor(app: Application) {
    this.app = app
  }
  
  public destroy() {
    this.text.destroy()
  }
  
  public reRender(success = true) {
    this.destroy()
    this.render(success)
  }
  
  public render(success = true) {
    const style = new TextStyle({
      fill: success ? GREEN_COLOR : RED_COLOR
    })
    this.text = new Text(success ? 'Win!' : 'Loss :-(')
    this.text.x = this.app.renderer.width / 2 - this.text.width / 2
    this.text.y = PADDING_TOP
    this.text.style = style
    this.app.stage.addChild(this.text)
    setTimeout(() => {
      this.destroy()
    }, 2000)
  }
}
