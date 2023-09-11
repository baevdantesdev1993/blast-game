import {IBlock, IMoveBlock, IPosition, IScene} from '../interfaces';
import {
	ALARM_COLOR,
	FIELD_PADDING,
	MAX_MIXES,
	MAX_TURNS,
	MD_DISTANCE,
	MOBILE_BREAKPOINT,
	SUCCESS_COLOR,
	WIN_POINTS
} from '../constants';
import Block from '../components/Block';
import {app, blockSizeVal, fieldSizeVal, gameModel} from '../index';
import delay from '../utils/delay';
import comparePositions from '../utils/comparePositions';
import Display from '../components/Display';
import Field from '../components/Field';
import {Container} from 'pixi.js';
import GameResult from '../components/GameResult';
import {GameStatus} from '../types';

export default class Main extends Container implements IScene {
	private blocks: Block[] = [];
	private pointsDisplay: Display;
	private turnsDisplay: Display;
	private mixesDisplay: Display;
	private gameResult: GameResult;
	private field: Field;
 
	constructor() {
		super();
	}
 
	private disableField(flag: boolean) {
		document.getElementById('app').style.pointerEvents = flag ? 'none' : 'all';
	}
 
	private async reGenerateField(afterMix = false) {
		if (!afterMix) {
			gameModel.generateBlocks();
		}
		await this.reCreate();
	}
 
	private async updateDisplays() {
		await Promise.all([
			this.pointsDisplay.update({
				content: `Points: ${gameModel.points}/${WIN_POINTS}`,
				filledPercent: (gameModel.points / WIN_POINTS)
			}),
			this.turnsDisplay.update({
				content: `Turns: ${gameModel.turns}/${MAX_TURNS}`,
				filledPercent: (gameModel.turns / MAX_TURNS)
			}),
			this.mixesDisplay.update({
				content: `Mixes: ${gameModel.mixes}/${MAX_MIXES}`,
				filledPercent: (gameModel.mixes / MAX_MIXES)
			})
		]);
	}
 
	private async removeBlocks(blocksToBeRemoved: IBlock[]) {
		await Promise.all(
			blocksToBeRemoved.map(async (block) => {
				const found = this.blocks.find(b =>
					comparePositions(b.properties.position, block.position)
				);
				if (found) {
					await found.remove();
				}
			})
		);
		blocksToBeRemoved.forEach((block) => {
			const found = this.blocks.find(b =>
				comparePositions(b.properties.position, block.position)
			);
			if (found) {
				this.blocks.splice(
					this.blocks.indexOf(found),
					1
				);
			}
		});
	}
 
	private async moveBlocks(blocksToBeMoved: IMoveBlock[]) {
		await Promise.all(
			blocksToBeMoved.map(async (block) => {
				const found = this.blocks.find(b =>
					comparePositions(b.properties.position, block.block.position)
				);
				if (found) {
					await found.moveTo(block.target, this.getBlockPosition(block.target));
				}
			})
		);
	}
 
	private getBlockPosition(pos: IPosition) {
		return {
			x: (this.field.x - fieldSizeVal / 2)
        + (pos.x * blockSizeVal)
        + FIELD_PADDING - blockSizeVal,
			y: (this.field.y - fieldSizeVal / 2)
        + (pos.y * blockSizeVal)
        + FIELD_PADDING - blockSizeVal
		};
	}
 
	private async addBlocks(blocksToBeAdded: IBlock[]) {
		await Promise.all(
			blocksToBeAdded.map(async (blockItem) => {
				const block = new Block(
					{
						position: this.getBlockPosition(blockItem.position),
						width: blockSizeVal,
						height: blockSizeVal,
						block: JSON.parse(JSON.stringify(blockItem)),
						onClickCallBack: this.onBlockClick.bind(this),
					});
				this.blocks.push(block);
				this.addChild(block);
				await block.addBlock();
				return block;
			})
		);
	}
 
	public async onBlockClick(block: Block) {
		try {
			const res = gameModel.onBlockClick(block.properties);
			if (res.success) {
				this.disableField(true);
				await this.removeBlocks(res.stages.remove.removedBlocks);
				if (res.stages.move.movedBlocks.length) {
					await this.moveBlocks(res.stages.move.movedBlocks);
				}
				await delay(100);
				await this.addBlocks(res.stages.add.addedBlocks);
				await delay(100);
			}
			const {gameStatus} = res;
			if (gameStatus === 'mix') {
				this.renderGameResult(gameStatus);
				await this.reGenerateField(true);
				this.mixesDisplay.reCreate();
			}
			if (gameStatus === 'loss' || gameStatus === 'win') {
				this.renderGameResult(gameStatus);
				await this.reGenerateField();
			}
		} catch (e) {
			console.error(e);
		} finally {
			this.disableField(false);
			await this.updateDisplays();
		}
	}
 
	public async reCreate() {
		this.blocks.forEach((block) => {
			block.destroy();
		});
		this.blocks = [];
		await this.renderBlocks();
	}
 
	private async renderBlocks() {
		return Promise.all(
			gameModel.blocks.map(async (b) => {
				const block = new Block(
					{
						position: this.getBlockPosition(b.position),
						width: blockSizeVal,
						height: blockSizeVal,
						block: JSON.parse(JSON.stringify(b)),
						onClickCallBack: this.onBlockClick.bind(this),
					});
				this.addChild(block);
				await block.addBlock();
				this.blocks.push(block);
				return block;
			})
		);
	}
 
	private renderPointsDisplay() {
		this.pointsDisplay = new Display({
			position: {
				x: app.renderer.width / 2 - fieldSizeVal / 2 + FIELD_PADDING,
				y: MD_DISTANCE
			},
			align: 'left',
			content: `Points: ${gameModel.points}/${WIN_POINTS}`,
			color: SUCCESS_COLOR,
			filledPercent: 0.001
		});
		this.addChild(this.pointsDisplay);
	}
 
	private renderTurnsDisplay() {
		this.turnsDisplay = new Display({
			position: {
				x: app.renderer.width / 2 + fieldSizeVal / 2 - FIELD_PADDING,
				y: MD_DISTANCE
			},
			align: 'right',
			content: `Turns: ${gameModel.turns}/${MAX_TURNS}`,
			color: ALARM_COLOR,
			filledPercent: (gameModel.turns / MAX_TURNS)
		});
		this.addChild(this.turnsDisplay);
	}
 
	private renderMixesDisplay() {
		this.mixesDisplay = new Display({
			position: {
				x: app.renderer.width / 2 - fieldSizeVal / 2 + FIELD_PADDING,
				y: app.renderer.height - MD_DISTANCE * 4
			},
			align: 'left',
			content: `Mixes: ${gameModel.mixes}/${MAX_MIXES}`,
			color: ALARM_COLOR,
			filledPercent: (gameModel.mixes / MAX_MIXES)
		});
		this.addChild(this.mixesDisplay);
	}
 
	private renderGameResult(gameStatus: GameStatus) {
		this.gameResult = new GameResult({
			position: {
				x: app.renderer.width / 2,
				y: app.renderer.width <= MOBILE_BREAKPOINT ? 70 : 100
			},
		});
		this.gameResult.create(gameStatus);
		this.addChild(this.gameResult);
	}
 
	private renderField() {
		this.field = new Field({
			position: {
				x: app.renderer.width / 2,
				y: app.renderer.height / 2
			},
			width: fieldSizeVal,
			height: fieldSizeVal,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		});
		this.addChild(this.field);
	}
 
	public async init() {
		this.renderField();
		this.renderPointsDisplay();
		this.renderTurnsDisplay();
		this.renderMixesDisplay();
		await this.renderBlocks();
		app.stage.addChild(this);
	}
}
