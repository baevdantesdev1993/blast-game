import {IBaseComponent} from "../interfaces";
import {Application, Text, TextStyle} from "pixi.js";
import {PADDING_TOP} from "../constants";

export default class GameResult implements IBaseComponent {
  private app: Application
  private text: Text
  
  constructor(app: Application) {
    this.app = app
  }
  
  public destroy() {
    this.text.destroy()
  }
  
  public render(success = true) {
    const style = new TextStyle({
      fill: success ? 'green' : 'red'
    })
    this.text = new Text(success ? 'Win!' : 'Loss :-(')
    this.text.x = this.app.renderer.width / 2 - this.text.width / 2
    this.text.y = PADDING_TOP
    this.text.style = style
    this.app.stage.addChild(this.text)
    setTimeout(() => {
      this.destroy()
    }, 2000)
    return this.text
  }
}
