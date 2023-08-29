import {BlockColor, blockColors} from "./blocksMap";
import {randomIntFromInterval} from "./randomIntFromInterval";

export default (): BlockColor => {
  return blockColors[randomIntFromInterval(0, blockColors.length - 1)]
}
