import {IBaseComponent} from "../interfaces";
import FieldImage from '../assets/field.png'
import {FIELD_SIZE} from "../constants";

export default class FieldComponent implements IBaseComponent {
  public render() {
    const el = new Image(FIELD_SIZE, FIELD_SIZE)
    el.src = FieldImage
    return el
  }
}
