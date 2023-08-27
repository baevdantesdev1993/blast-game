import {IBaseComponent} from "../interfaces";
import FieldImage from '../assets/field.png'
import {FIELD_SIZE} from "../constants";
import {Assets, Sprite} from "pixi.js";

export default class FieldComponent implements IBaseComponent {
  public async render() {
    const image = new Image(FIELD_SIZE, FIELD_SIZE)
    image.src = FieldImage
    const texture = await Assets.load(image.src);
    const sprite = new Sprite(texture);
    sprite.width = FIELD_SIZE
    sprite.height = FIELD_SIZE
    return sprite
  }
}
