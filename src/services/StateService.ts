import {IBlock, IPosition, IStateService} from "../interfaces";
import {blockColors} from "../utils/blocksMap";
import {randomIntFromInterval} from "../utils/randomIntFromInterval";
import {BLASTED_BLOCKS_COUNT, BLOCKS_IN_ROW} from "../constants";
import {BlockDirection} from "../types";

export class StateService implements IStateService {
  public blocksQuantity: number = 0
  public blocksList: IBlock[] = []
  private blocksAround: IBlock[] = []
  private turnsCount: number = 0
  private pointsCount: number = 0
  
  public get turns(): number {
    return this.turnsCount
  }
  
  public get points(): number {
    return this.pointsCount
  }
  
  private incrementTurnsCount() {
    this.turnsCount++
  }
  
  private setPoints(points: number) {
    this.pointsCount += points
  }
  
  constructor(quantity: number) {
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
        empty: false
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
  
  private getLeft(block: IBlock) {
    return this.blocksList.find((b) => {
      return block.position.x === b.position.x - 1
        && b.position.y === block.position.y
        && b.color === block.color
    })
  }
  
  
  private isEqualBlocksPositions(target: IBlock, source: IBlock): boolean {
    return target.position.x === source.position.x
      && target.position.y === source.position.y
  }
  
  private existsBlockForDelete(block: IBlock) {
    return this.blocksAround.some((b) => {
      return block.position.x === b.position.x
        && block.position.y === b.position.y
    })
  }
  
  public clearRelatedBlocksList() {
    this.blocksAround = []
  }
  
  public async onBlockClick(block: IBlock): Promise<void> {
    try {
      const res = await this.onTryToBlast(block)
      const success = Boolean(res?.length)
      if (success) {
        this.setPoints(res.length)
      }
      this.incrementTurnsCount()
      return success ? Promise.resolve() : Promise.reject()
    } catch (e) {
      console.error(e)
    }
  }
  
  private async findRelatedBlocks(direction: BlockDirection, block: IBlock) {
    switch (direction) {
      case "top":
        if (block) {
          if (this.existsBlockForDelete(block)) {
            break
          }
          const nextIterationBlocks = await this.onTryToBlast(block, 'bottom')
          if (!nextIterationBlocks?.length) {
            break
          }
        }
        break
      case "bottom":
        if (block) {
          if (this.existsBlockForDelete(block)) {
            break
          }
          const nextIterationBlocks = await this.onTryToBlast(block, 'top')
          if (!nextIterationBlocks?.length) {
            break
          }
        }
        break
      case "right":
        if (block) {
          if (this.existsBlockForDelete(block)) {
            break
          }
          const nextIterationBlocks = await this.onTryToBlast(block, 'left')
          if (!nextIterationBlocks?.length) {
            break
          }
        }
        break
      case "left":
        if (block) {
          if (this.existsBlockForDelete(block)) {
            break
          }
          const nextIterationBlocks = await this.onTryToBlast(block, 'right')
          if (!nextIterationBlocks?.length) {
            break
          }
        }
    }
  }
  
  private async onTryToBlast(originalBlock: IBlock, excludeDirection: BlockDirection = null) {
    const top = this.getTop(originalBlock)
    const right = this.getRight(originalBlock)
    const left = this.getLeft(originalBlock)
    const bottom = this.getBottom(originalBlock)
    
    const foundOriginal = this.blocksList.find((b) =>
      this.isEqualBlocksPositions(b, originalBlock))
    
    if (foundOriginal) {
      this.blocksAround.push(foundOriginal)
    }
    
    if (excludeDirection !== 'top') await this.findRelatedBlocks('top', top)
    if (excludeDirection !== 'right') await this.findRelatedBlocks('right', right)
    if (excludeDirection !== 'bottom') await this.findRelatedBlocks('bottom', bottom)
    if (excludeDirection !== 'left') await this.findRelatedBlocks('left', left)
    
    if (this.blocksAround.length < BLASTED_BLOCKS_COUNT) {
      return
    }
    
    this.blocksAround.forEach((blockAround) => {
      const found = this.blocksList.find((b) =>
        this.isEqualBlocksPositions(b, blockAround))
      
      if (found) {
        found.empty = true
      }
    })
    
    return this.blocksAround
  }
}
