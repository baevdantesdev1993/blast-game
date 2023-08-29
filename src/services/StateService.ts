import {IBlock, IPosition, IStateService} from "../interfaces";
import {BLASTED_BLOCKS_COUNT, BLOCKS_IN_COLUMN, BLOCKS_IN_ROW, MAX_TURNS, WIN_POINTS} from "../constants";
import {BlockDirection, WinStatus} from "../types";
import getRandomBlockColor from "../utils/getRandomBlockColor";
import getSuperBoostRandom from "../utils/getSuperBoostRandom";

export class StateService implements IStateService {
  public blocksQuantity: number = 0
  public blocksList: IBlock[] = []
  private blocksAround: IBlock[] = []
  private turnsCount: number = MAX_TURNS
  private pointsCount: number = 0
  
  constructor(quantity: number) {
    this.blocksQuantity = quantity
    this.generateBlocks()
  }
  
  private moveDownBlocksToEmptyCells() {
    this.reversedColumns.forEach((column) => {
      let emptyFlowLength = 0
      let emptyFlow = false
      let yPositionForAdding = 1
      column.forEach((block) => {
        if (block.empty) {
          if (!emptyFlow) {
            emptyFlow = true
          }
          emptyFlowLength++
          const found = this.findBlockByPos(
            {x: block.position.x, y: block.position.y}
          )
          
          if (found && found.empty) {
            const index = this.blocksList.indexOf(found)
            this.blocksList.splice(index, 1)
            this.blocksList.push({
              position: {
                x: block.position.x,
                y: yPositionForAdding
              },
              color: getRandomBlockColor(),
              superBoost: getSuperBoostRandom(),
              empty: false
            })
            yPositionForAdding++
          }
        } else {
          emptyFlow = false
          block.position.y = block.position.y + emptyFlowLength
        }
      })
    })
  }
  
  public generateBlocks() {
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
        color: getRandomBlockColor(),
        position: currentPosition,
        superBoost: getSuperBoostRandom(),
        empty: false
      }
    })
    
    console.log(this.blocksList.filter(b => b.superBoost))
    
    return this.blocksList
  }
  
  public get turns(): number {
    return this.turnsCount
  }
  
  public get points(): number {
    return this.pointsCount
  }
  
  private decrementTurnsCount() {
    this.turnsCount--
  }
  
  private get columns(): IBlock[][] {
    const arr: IBlock[][] = []
    for (let x = 1; x <= BLOCKS_IN_COLUMN; x++) {
      const nestedArr: IBlock[] = []
      for (let y = 1; y <= BLOCKS_IN_ROW; y++) {
        const found = this.findBlockByPos({x, y})
        if (found) {
          nestedArr.push(found)
        }
      }
      arr.push(nestedArr)
    }
    
    return arr
  }
  
  private get reversedColumns(): IBlock[][] {
    return this.columns.map((c) => c.reverse())
  }
  
  private setPoints(points: number) {
    this.pointsCount += points
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
  
  private findBlockByPos(pos: IPosition): IBlock {
    return this.blocksList.find((b) =>
      b.position.x === pos.x
      && b.position.y === pos.y)
  }
  
  public clearRelatedBlocksList() {
    this.blocksAround = []
  }
  
  public async onBlockClick(block: IBlock): Promise<WinStatus> {
    this.decrementTurnsCount()
    try {
      const res = await this.onTryToBlast(block)
      const success = Boolean(res?.length)
      if (success) {
        this.setPoints(res.length)
        this.moveDownBlocksToEmptyCells()
      }
      const winStatus = this.getWinStatus()
      if (winStatus !== 'progress') {
        this.pointsCount = 0
        this.turnsCount = MAX_TURNS
      }
      return winStatus
    } catch (e) {
      console.error(e)
    }
  }
  
  private getWinStatus(): WinStatus {
    if (this.points >= WIN_POINTS && this.turns >= 0) {
      return 'win'
    }
    if (this.turns === 0 && this.points < WIN_POINTS) {
      return 'loss'
    }
    return 'progress'
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
