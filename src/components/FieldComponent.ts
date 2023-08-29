import {IBaseComponent} from "../interfaces";
import FieldImage from '../assets/field.png'
import {FIELD_SIZE} from "../constants";
import {Application, Assets, Sprite} from "pixi.js";

export default class FieldComponent implements IBaseComponent {
  private app: Application
  private object: Sprite
  
  constructor(app: Application) {
    this.app = app
  }
  
  public async render() {
    const image = new Image(FIELD_SIZE, FIELD_SIZE)
    image.src = FieldImage
    const texture = await Assets.load(image.src);
    this.object = new Sprite(texture);
    this.object.width = FIELD_SIZE
    this.object.height = FIELD_SIZE
    
    this.object.x = this.app.renderer.width / 2;
    this.object.y = this.app.renderer.height / 2;
    this.object.anchor.x = 0.5;
    this.object.anchor.y = 0.5;
    this.app.stage.addChild(this.object);
    
    return this.object
  }
}
