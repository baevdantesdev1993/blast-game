import {IBlock, IStateService} from "../interfaces";
import {blockColors} from "../utils/blocksMap";
import {randomIntFromInterval} from "../utils/randomIntFromInterval";
import {v4 as generateId} from 'uuid';
import {BLOCKS_QUANTITY} from "../constants";

export class StateService implements IStateService {
  public blocksQuantity: number = 0
  public blocksList: IBlock[] = []
  
  constructor(quantity: number) {
    this.blocksQuantity = quantity
    this.blocksList = [...Array(this.blocksQuantity).keys()].map(() => {
      return {
        color: blockColors[randomIntFromInterval(0, blockColors.length - 1)],
        position: {
          x: 0,
          y: 0
        },
        id: generateId()
      }
    })
  }
}

const state = new StateService(BLOCKS_QUANTITY)

export default state
