import {IBlock, IMoveBlock, IPosition} from '../interfaces';
import {BLOCK_SIZE, COMMON_PADDING, FIELD_PADDING, FIELD_SIZE} from '../constants';
import Block from '../components/Block';
import {app, gameModel} from '../index';
import delay from '../utils/delay';
import comparePositions from '../utils/comparePositions';
import PointsDisplay from '../components/PointsDisplay';
import Field from '../components/Field';
import {Container} from 'pixi.js';
import TurnsDisplay from '../components/TurnsDisplay';
import MixesDisplay from '../components/MixesDisplay';
import GameResult from '../components/GameResult';
import {GameStatus} from '../types';

export default class MainScene extends Container {
	private blocks: Block[] = [];
	private pointsDisplay: PointsDisplay;
	private turnsDisplay: TurnsDisplay;
	private mixesDisplay: MixesDisplay;
	private gameResult: GameResult;
	private field: Field;
 
	constructor() {
		super();
	}
 
	private disableField(flag: boolean) {
		document.getElementById('app').style.pointerEvents = flag ? 'none' : 'all';
	}
 
	private reGenerateField(afterMix = false) {
		if (!afterMix) {
			gameModel.generateBlocks();
		}
		this.reCreate();
	}
 
	private reRenderAllTheDisplays() {
		this.pointsDisplay.reCreate();
		this.turnsDisplay.reCreate();
		this.mixesDisplay.reCreate();
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
			x: (this.field.x - FIELD_SIZE / 2) + (pos.x * BLOCK_SIZE) + FIELD_PADDING - BLOCK_SIZE,
			y: (this.field.y - FIELD_SIZE / 2) + (pos.y * BLOCK_SIZE) + FIELD_PADDING - BLOCK_SIZE
		};
	}
 
	private addBlocks(blocksToBeAdded: IBlock[]) {
		blocksToBeAdded.forEach((block) => {
			const blockScene = new Block(
				{
					position: this.getBlockPosition(block.position),
					width: BLOCK_SIZE,
					height: BLOCK_SIZE,
					block: JSON.parse(JSON.stringify(block)),
					onClickCallBack: this.onBlockClick.bind(this),
				});
			this.blocks.push(blockScene);
			this.addChild(blockScene);
		});
	}
 
	public async onBlockClick(block: Block) {
		try {
			const res = gameModel.onBlockClick(block.properties);
			if (res.success) {
				this.disableField(true);
				await this.removeBlocks(res.stages.remove.removedBlocks);
				if (res.stages.move.movedBlocks.length) {
					await this.moveBlocks(res.stages.move.movedBlocks);
					await delay(200);
				}
				this.addBlocks(res.stages.add.addedBlocks);
			}
			const {gameStatus} = res;
			if (gameStatus === 'mix') {
				this.reGenerateField(true);
				this.mixesDisplay.reCreate();
				this.renderGameResult(gameStatus);
				return;
			}
			if (gameStatus === 'loss' || gameStatus === 'win') {
				this.reGenerateField();
				this.renderGameResult(gameStatus);
				return;
			}
		} catch (e) {
			console.error(e);
		} finally {
			this.reRenderAllTheDisplays();
			this.disableField(false);
		}
	}
 
	public remove() {
		this.blocks.forEach((b) => b.remove());
		this.blocks = [];
		this.removeChildren(0, this.children.length);
	}
 
	public reCreate() {
		this.remove();
		this.create();
	}
 
	private renderBlocks() {
		gameModel.blocks.forEach((b) => {
			const block = new Block(
				{
					position: this.getBlockPosition(b.position),
					width: BLOCK_SIZE,
					height: BLOCK_SIZE,
					block: JSON.parse(JSON.stringify(b)),
					onClickCallBack: this.onBlockClick.bind(this),
				});
			this.addChild(block);
			this.blocks.push(block);
		});
	}
 
	private renderPointsDisplay() {
		this.pointsDisplay = new PointsDisplay({
			position: {
				x: app.renderer.width / 2 - FIELD_SIZE / 2 + FIELD_PADDING,
				y: COMMON_PADDING
			},
		}, 'left');
		this.addChild(this.pointsDisplay);
	}
 
	private renderTurnsDisplay() {
		this.turnsDisplay = new TurnsDisplay({
			position: {
				x: app.renderer.width / 2 + FIELD_SIZE / 2 - FIELD_PADDING,
				y: COMMON_PADDING
			},
		}, 'right');
		this.addChild(this.turnsDisplay);
	}
 
	private renderMixesDisplay() {
		this.mixesDisplay = new MixesDisplay({
			position: {
				x: app.renderer.width / 2 - FIELD_SIZE / 2 + FIELD_PADDING,
				y: app.renderer.height - COMMON_PADDING * 4
			},
		}, 'left');
		this.addChild(this.mixesDisplay);
	}
 
	private renderGameResult(gameStatus: GameStatus) {
		this.gameResult = new GameResult({
			position: {
				x: app.renderer.width / 2,
				y: COMMON_PADDING
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
			width: FIELD_SIZE,
			height: FIELD_SIZE,
			anchor: {
				x: 0.5,
				y: 0.5
			}
		});
		this.addChild(this.field);
	}
 
	public create() {
		this.renderField();
		this.renderPointsDisplay();
		this.renderTurnsDisplay();
		this.renderMixesDisplay();
		this.renderBlocks();
		app.stage.addChild(this);
	}
}
