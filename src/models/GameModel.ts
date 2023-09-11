import {IBlastResult, IBlock, IMoveBlock, IPosition, ITurnResult} from '../interfaces';
import {
	BLASTED_BLOCKS_COUNT,
	BLOCKS_IN_COLUMN,
	BLOCKS_IN_ROW,
	MAX_MIXES,
	MAX_TURNS,
	SUPER_BOOST_RADIUS,
	WIN_POINTS
} from '../constants';
import {BlockDirection, GameStatus} from '../types';
import getRandomBlockColor from '../utils/getRandomBlockColor';
import getSuperBoostRandom from '../utils/getSuperBoostRandom';
import comparePositions from '../utils/comparePositions';

export class GameModel {
	private blocksQuantity: number = 0;
	private blocksList: IBlock[] = [];
	private blocksToBeRemoved: IBlock[] = [];
	private turnsCount: number = MAX_TURNS;
	private pointsCount: number = 0;
	private mixesCount: number = MAX_MIXES;
	private blocksToBeMoved: IMoveBlock[] = [];
	private blocksToBeAdded: IBlock[] = [];
 
	public get blocks(): IBlock[] {
		return this.blocksList;
	}
 
	constructor(quantity: number) {
		this.blocksQuantity = quantity;
		this.generateBlocks();
	}
 
	public get mixes(): number {
		return this.mixesCount;
	}
 
	private checkAvailabilityToBlast(): boolean {
		if (this.blocksList.some((b) => b.superBoost)) {
			return true;
		}
  
		return this.blocksList
			.some((b) => {
				const {result} = this.tryToRemove(b, null, true);
				this.clearBlocksToBeRemoved();
				return result.length;
			});
	}
 
	private addNewBlocks() {
		this.blocksToBeAdded = [];
		this.reversedColumns.forEach((column, index) => {
			for (let y = BLOCKS_IN_COLUMN; y >= 1; y--) {
				const foundBlock = column.find(b => b.position.y === y);
				if (!foundBlock) {
					const newBlock: IBlock = {
						position: {
							x: index + 1,
							y
						},
						color: getRandomBlockColor(),
						superBoost: getSuperBoostRandom()
					};
					this.blocksToBeAdded.push(newBlock);
				}
			}
		});
		this.blocksList.push(...this.blocksToBeAdded);
	}
 
	private moveBlocks() {
		this.blocksToBeMoved = [];
		this.reversedColumns.forEach((column) => {
			let emptyFlowLength = 0;
			for (let y = BLOCKS_IN_COLUMN; y >= 1; y--) {
				const foundBlock = column.find(b => b.position.y === y);
				if (!foundBlock) {
					emptyFlowLength++;
				} else {
					const initialBlock: IBlock = JSON.parse(JSON.stringify(foundBlock));
					if (emptyFlowLength) {
						this.blocksToBeMoved.push({
							block: initialBlock,
							target: {
								x: foundBlock.position.x,
								y: foundBlock.position.y + emptyFlowLength
							}
						});
					}
				}
			}
		});
		this.updateBlocksListAfterMove();
	}
	
	private updateBlocksListAfterMove() {
		this.blocksToBeMoved.forEach((block) => {
			const found = this.blocksList.find((b) =>
				comparePositions(b.position, block.block.position)
			);
			if (found) {
				found.position = block.target;
			}
		});
	}
 
	public generateBlocks() {
		const position: IPosition = {
			x: 1,
			y: 1
		};
		this.blocksList = [...Array(this.blocksQuantity).keys()].map((item, index) => {
			const currentPosition = Object.assign({}, position);
			if ((index + 1) % BLOCKS_IN_ROW === 0) {
				position.y++;
				position.x = 1;
			} else {
				position.x++;
			}
			return {
				color: getRandomBlockColor(),
				position: currentPosition,
				superBoost: getSuperBoostRandom(),
			};
		});
  
		if (!this.checkAvailabilityToBlast()) {
			this.generateBlocks();
			return;
		}
  
		return this.blocksList;
	}
 
	public get turns(): number {
		return this.turnsCount;
	}
 
	public get points(): number {
		return this.pointsCount;
	}
 
	private decrementTurnsCount() {
		this.turnsCount--;
	}
 
	private get columns(): IBlock[][] {
		const arr: IBlock[][] = [];
		for (let x = 1; x <= BLOCKS_IN_COLUMN; x++) {
			const nestedArr: IBlock[] = [];
			for (let y = 1; y <= BLOCKS_IN_ROW; y++) {
				const found = this.findBlockByPos({x, y});
				if (found) {
					nestedArr.push(found);
				}
			}
			arr.push(nestedArr);
		}
  
		return arr;
	}
 
	private get reversedColumns(): IBlock[][] {
		return this.columns.map((c) => c.reverse());
	}
 
	private setPoints(points: number) {
		this.pointsCount += points;
	}
 
	private getTop(block: IBlock) {
		return this.blocksList.find((b) => {
			return block.position.x === b.position.x
        && b.position.y === block.position.y - 1
        && b.color === block.color;
		});
	}
 
	private getBottom(block: IBlock) {
		return this.blocksList.find((b) => {
			return block.position.x === b.position.x
        && b.position.y === block.position.y + 1
        && b.color === block.color;
		});
	}
 
	private getRight(block: IBlock) {
		return this.blocksList.find((b) => {
			return block.position.x === b.position.x + 1
        && b.position.y === block.position.y
        && b.color === block.color;
		});
	}
 
	private getLeft(block: IBlock) {
		return this.blocksList.find((b) => {
			return block.position.x === b.position.x - 1
        && b.position.y === block.position.y
        && b.color === block.color;
		});
	}
 
 
	private isEqualBlocksPositions(target: IBlock, source: IBlock): boolean {
		return target.position.x === source.position.x
      && target.position.y === source.position.y;
	}
 
	private existsBlockForDelete(block: IBlock) {
		return this.blocksToBeRemoved.some((b) =>
			comparePositions(b.position, block.position)
		);
	}
 
	private findBlockByPos(pos: IPosition): IBlock {
		return this.blocksList.find((b) =>
			b.position.x === pos.x
      && b.position.y === pos.y);
	}
 
	private clearBlocksToBeRemoved() {
		this.blocksToBeRemoved = [];
	}
 
	public onSuperBoost(block: IBlock): IBlastResult {
		this.decrementTurnsCount();
		const superBoostSide = SUPER_BOOST_RADIUS * 2;
		const extremeInitialPoint: IPosition = {
			x: block.position.x - SUPER_BOOST_RADIUS,
			y: block.position.y - SUPER_BOOST_RADIUS
		};
		for (let y = 0; y <= superBoostSide; y++) {
			for (let x = 0; x <= superBoostSide; x++) {
				const foundBlock: IBlock = this.findBlockByPos({
					x: extremeInitialPoint.x + x,
					y: extremeInitialPoint.y + y
				});
				if (foundBlock) {
					this.blocksToBeRemoved.push(foundBlock);
				}
			}
		}
		this.removeBlocks(false);
		return {
			isChecking: false,
			result: this.blocksToBeRemoved
		};
	}
 
	public onBlockClick(block: IBlock): ITurnResult {
		this.decrementTurnsCount();
		try {
			let check = true;
			const res = block.superBoost
				? this.onSuperBoost(block)
				: this.tryToRemove(block, null, false);
			this.clearBlocksToBeRemoved();
			const success = Boolean(!res.isChecking && res.result.length);
			if (success) {
				this.setPoints(res.result.length);
				this.moveBlocks();
				this.addNewBlocks();
				check = this.checkAvailabilityToBlast();
			}
			const gameStatus = this.getGameStatus(check);
			if (gameStatus !== 'progress' && gameStatus !== 'mix') {
				this.setInitValues();
			}
			return {
				success,
				gameStatus,
				blocksList: this.blocksList,
				stages: {
					remove: {
						removedBlocks: res.result,
					},
					move: {
						movedBlocks: this.blocksToBeMoved
					},
					add: {
						addedBlocks: this.blocksToBeAdded
					}
				}
			};
		} catch (e) {
			console.error(e);
		}
	}
 
	private setInitValues() {
		this.mixesCount = MAX_MIXES;
		this.pointsCount = 0;
		this.turnsCount = MAX_TURNS;
	}
 
	private getGameStatus(check: boolean): GameStatus {
		if (this.points >= WIN_POINTS && this.turns >= 0) {
			return 'win';
		}
		if (this.turns === 0 && this.points < WIN_POINTS) {
			return 'loss';
		}
		if (!check && this.mixesCount === 0) {
			return 'loss';
		}
		if (!check && this.mixesCount > 0) {
			this.mixesCount--;
			this.generateBlocks();
			return 'mix';
		}
		return 'progress';
	}
 
	private findRelatedBlocks(direction: BlockDirection, block: IBlock, isChecking: boolean) {
		const excludeDirectionMap: Record<BlockDirection, BlockDirection> = {
			top: 'bottom',
			right: 'left',
			bottom: 'top',
			left: 'right'
		};
		if (block) {
			if (this.existsBlockForDelete(block)) {
				return;
			}
			const nextIterationBlocks =
        this.tryToRemove(block, excludeDirectionMap[direction], isChecking);
			if (!nextIterationBlocks?.result.length) {
				return;
			}
		}
  
		return;
	}
 
	private tryToRemove(originalBlock: IBlock,
		excludeDirection: BlockDirection,
		isChecking: boolean): IBlastResult {
		const foundOriginal = this.blocksList.find((b) =>
			this.isEqualBlocksPositions(b, originalBlock));
   
		if (foundOriginal) {
			this.blocksToBeRemoved.push(foundOriginal);
		}
  
		if (excludeDirection !== 'top') {
			this.findRelatedBlocks('top', this.getTop(originalBlock), isChecking);
		}
		if (excludeDirection !== 'right') {
			this.findRelatedBlocks('right', this.getRight(originalBlock), isChecking);
		}
		if (excludeDirection !== 'bottom') {
			this.findRelatedBlocks('bottom', this.getBottom(originalBlock), isChecking);
		}
		if (excludeDirection !== 'left') {
			this.findRelatedBlocks('left', this.getLeft(originalBlock), isChecking);
		}
  
		const removeRes = this.removeBlocks(isChecking);
  
		if (removeRes) {
			return {
				isChecking,
				result: removeRes ? this.blocksToBeRemoved : []
			};
		}
  
		return {
			isChecking,
			result: []
		};
	}
 
	removeBlocks(isChecking: boolean): boolean {
		if (this.blocksToBeRemoved.length < BLASTED_BLOCKS_COUNT) {
			return false;
		}
  
		if (!isChecking) {
			this.blocksToBeRemoved.forEach((blockAround) => {
				const found = this.blocksList.find((b) =>
					this.isEqualBlocksPositions(b, blockAround));
     
				if (found) {
					this.blocksList.splice(
						this.blocksList.indexOf(found), 1
					);
				}
			});
		}
  
		return true;
	}
}
