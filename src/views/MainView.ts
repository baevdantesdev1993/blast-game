import {IBlock, IMoveBlock, IPosition} from '../interfaces';
import {BLOCK_SIZE, COMMON_PADDING, FIELD_PADDING, FIELD_SIZE} from '../constants';
import BlockScene from '../scenes/BlockScene';
import {app, gameModel} from '../index';
import delay from '../utils/delay';
import comparePositions from '../utils/comparePositions';
import PointsDisplayScene from '../scenes/PointsDisplayScene';
import FieldScene from '../scenes/FieldScene';
import {Container} from 'pixi.js';
import TurnsDisplayScene from '../scenes/TurnsDisplayScene';
import MixesDisplayScene from '../scenes/MixesDisplayScene';
import GameResultScene from '../scenes/GameResultScene';
import {GameStatus} from '../types';

export default class MainView extends Container {
	private blocks: BlockScene[] = [];
	private pointsDisplay: PointsDisplayScene;
	private turnsDisplay: TurnsDisplayScene;
	private mixesDisplay: MixesDisplayScene;
	private gameResult: GameResultScene;
	private field: FieldScene;
 
	constructor() {
		super();
		this.width = app.renderer.width;
		this.height = app.renderer.height;
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
 
	private reRenderAllTheDisplays() {
		this.pointsDisplay.reCreate();
		this.turnsDisplay.reCreate();
		this.mixesDisplay.reCreate();
	}
 
	private removeBlocks(blocksToBeRemoved: IBlock[]) {
		blocksToBeRemoved.forEach((block) => {
			const found = this.blocks.find(b =>
				comparePositions(b.properties.position, block.position)
			);
			if (found) {
				this.removeChild(found);
			}
		});
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
 
	private moveBlocks(blocksToBeMoved: IMoveBlock[]) {
		return Promise.all(
			blocksToBeMoved.map(async (block) => {
				const found = this.blocks.find(b =>
					comparePositions(b.properties.position, block.block.position)
				);
				if (found) {
					this.removeChild(found);
					found.setPosition(block.target, this.getBlockPosition(block.target));
					this.addChild(found);
				}
    
				return found;
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
		return Promise.all(
			blocksToBeAdded.map(async (block) => {
				const blockScene = new BlockScene(
					{
						position: this.getBlockPosition(block.position),
						width: BLOCK_SIZE,
						height: BLOCK_SIZE,
						block: JSON.parse(JSON.stringify(block)),
						onClickCallBack: this.onBlockClick.bind(this),
					});
				await blockScene.create();
				this.blocks.push(blockScene);
				this.addChild(blockScene);
				return block;
			})
		);
	}
 
	public async onBlockClick(block: BlockScene) {
		try {
			const res = gameModel.onBlockClick(block.properties);
			if (res.success) {
				this.disableField(true);
				this.removeBlocks(res.stages.remove.removedBlocks);
				await delay(200);
				if (res.stages.move.movedBlocks.length) {
					await this.moveBlocks(res.stages.move.movedBlocks);
					await delay(200);
				}
				await this.addBlocks(res.stages.add.addedBlocks);
			}
			const {gameStatus} = res;
			if (gameStatus === 'mix') {
				await this.reGenerateField(true);
				this.mixesDisplay.reCreate();
				this.renderGameResult(gameStatus);
				return;
			}
			if (gameStatus === 'loss' || gameStatus === 'win') {
				await this.reGenerateField();
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
 
	public destroy() {
		this.blocks.forEach((b) => b.destroy());
		this.blocks = [];
		this.removeChildren(0, this.children.length);
	}
 
	public async reCreate() {
		this.destroy();
		await this.create();
	}
 
	private async renderBlocks() {
		return Promise.all(
			gameModel.blocks.map(async (b) => {
				const block = new BlockScene(
					{
						position: this.getBlockPosition(b.position),
						width: BLOCK_SIZE,
						height: BLOCK_SIZE,
						block: JSON.parse(JSON.stringify(b)),
						onClickCallBack: this.onBlockClick.bind(this),
					});
				await block.create();
				this.addChild(block);
				this.blocks.push(block);
				return b;
			})
		);
	}
 
	private renderPointsDisplay() {
		this.pointsDisplay = new PointsDisplayScene({
			position: {
				x: app.renderer.width / 2 - FIELD_SIZE / 2 + FIELD_PADDING,
				y: COMMON_PADDING
			},
		}, 'left');
		this.addChild(this.pointsDisplay);
	}
 
	private renderTurnsDisplay() {
		this.turnsDisplay = new TurnsDisplayScene({
			position: {
				x: app.renderer.width / 2 + FIELD_SIZE / 2 - FIELD_PADDING,
				y: COMMON_PADDING
			},
		}, 'right');
		this.addChild(this.turnsDisplay);
	}
 
	private renderMixesDisplay() {
		this.mixesDisplay = new MixesDisplayScene({
			position: {
				x: app.renderer.width / 2 - FIELD_SIZE / 2 + FIELD_PADDING,
				y: app.renderer.height - COMMON_PADDING * 4
			},
		}, 'left');
		this.addChild(this.mixesDisplay);
	}
	
	private renderGameResult(gameStatus: GameStatus) {
		this.gameResult = new GameResultScene({
			position: {
				x: app.renderer.width / 2,
				y: COMMON_PADDING
			},
		});
		this.gameResult.create(gameStatus);
		this.addChild(this.gameResult);
		setTimeout(() => {
			this.removeChild(this.gameResult);
		}, 3000);
	}
 
	private async renderField() {
		this.field = new FieldScene({
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
		await this.field.create();
		this.addChild(this.field);
	}
 
	public async create() {
		this.renderPointsDisplay();
		this.renderTurnsDisplay();
		this.renderMixesDisplay();
		await this.renderField();
		await this.renderBlocks();
		app.stage.addChild(this);
	}
}
