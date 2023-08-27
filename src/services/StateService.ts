import {IBlock, IPosition, IStateService} from "../interfaces";
import {blockColors} from "../utils/blocksMap";
import {randomIntFromInterval} from "../utils/randomIntFromInterval";
import {BLASTED_BLOCKS_COUNT, BLOCKS_IN_ROW} from "../constants";
import {Application} from "pixi.js";
import {renderMainField} from "../index";

export class StateService implements IStateService {
  public blocksQuantity: number = 0
  public blocksList: IBlock[] = []
  private app: Application
  
  constructor(quantity: number, app: Application) {
    this.app = app
    this.blocksQuantity = quantity
    const position: IPosition = {
      x: 1,
      y: 1
    }
    this.blocksList = [...Array(this.blocksQuantity).keys()].map((item, index) => {
      const currentPosition = Object.assign({}, position)
      if ((index + 1) % BLOCKS_IN_ROW === 0) {
        position.y++
        position.x = 1
      } else {
        position.x++
      }
      return {
        color: blockColors[randomIntFromInterval(0, blockColors.length - 1)],
        position: currentPosition,
      }
    })
  }
  
  private getTop(block: IBlock) {
    return this.blocksList.find((b) => {
      return block.position.x === b.position.x
        && b.position.y === block.position.y - 1
        && b.color === block.color
    })
  }
  
  private getBottom(block: IBlock) {
    return this.blocksList.find((b) => {
      return block.position.x === b.position.x
        && b.position.y === block.position.y + 1
        && b.color === block.color
    })
  }
  
  private getRight(block: IBlock) {
    return this.blocksList.find((b) => {
      return block.position.x === b.position.x + 1
        && b.position.y === block.position.y
        && b.color === block.color
    })
  }
  
  private getRLeft(block: IBlock) {
    return this.blocksList.find((b) => {
      return block.position.x === b.position.x - 1
        && b.position.y === block.position.y
        && b.color === block.color
    })
  }
  
  
  private compareBlocksPositions(target: IBlock, source: IBlock): boolean {
    return target.position.x === source.position.x
      && target.position.y === source.position.y
  }
  
  public async onClickBlock(originalBlock: IBlock) {
    const blocksAround: IBlock[] = []
    const top = this.getTop(originalBlock)
    if (top) {
      blocksAround.push(top)
      let upperTop = this.getTop(top)
      while (upperTop) {
        blocksAround.push(upperTop)
        upperTop = this.getTop(upperTop)
      }
    }
    
    const right = this.getRight(originalBlock)
    
    if (right) {
      blocksAround.push(right)
      let furtherRight = this.getRight(right)
      while (furtherRight) {
        blocksAround.push(furtherRight)
        furtherRight = this.getRight(furtherRight)
      }
    }
    
    const left = this.getRLeft(originalBlock)
    
    if (left) {
      blocksAround.push(left)
      let furtherLeft = this.getRLeft(left)
      while (furtherLeft) {
        blocksAround.push(furtherLeft)
        furtherLeft = this.getRLeft(furtherLeft)
      }
    }
    
    const bottom = this.getBottom(originalBlock)
    
    if (bottom) {
      blocksAround.push(bottom)
      let furtherBottom = this.getBottom(bottom)
      while (furtherBottom) {
        blocksAround.push(furtherBottom)
        furtherBottom = this.getBottom(furtherBottom)
      }
    }
    
    const foundSource = this.blocksList.find((b) => {
      return this.compareBlocksPositions(b, originalBlock)
    })
    
    if (foundSource) {
      blocksAround.push(foundSource)
    }
    
    if (blocksAround.length < BLASTED_BLOCKS_COUNT) {
      return
    }
    
    blocksAround.forEach((blockAround) => {
      const found = this.blocksList.find((b) => {
        return this.compareBlocksPositions(b, blockAround)
      })
      
      if (found) {
        const index = this.blocksList.indexOf(found)
        this.blocksList.splice(index, 1)
      }
    })
    await renderMainField()
  }
}
