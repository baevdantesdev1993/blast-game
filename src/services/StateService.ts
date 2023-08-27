import {IBlock, IPosition, IStateService} from "../interfaces";
import {blockColors} from "../utils/blocksMap";
import {randomIntFromInterval} from "../utils/randomIntFromInterval";
import {v4 as generateId} from 'uuid';
import {BLOCKS_IN_ROW, BLOCKS_QUANTITY} from "../constants";

export class StateService implements IStateService {
  public blocksQuantity: number = 0
  public blocksList: IBlock[] = []
  
  constructor(quantity: number) {
    this.blocksQuantity = quantity
    const position: IPosition = {
      x: 1,
      y: 1
    }
    this.blocksList = [...Array(this.blocksQuantity).keys()].map((item, index) => {
      if ((index + 1) % BLOCKS_IN_ROW === 0) {
        position.y++
      } else {
        position.x++
      }
      return {
        color: blockColors[randomIntFromInterval(0, blockColors.length - 1)],
        position: Object.assign({}, position),
        id: generateId()
      }
    })
  }
}

const state = new StateService(BLOCKS_QUANTITY)

export default state
