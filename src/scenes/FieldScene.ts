import {IBaseComponent, IBlock, IMoveBlock} from '../interfaces';
import FieldImage from '../assets/field.png';
import {BLOCK_SIZE, FIELD_PADDING, FIELD_SIZE} from '../constants';
import {Application, Assets, Sprite} from 'pixi.js';
import {GameModel} from '../models/GameModel';
import BlockScene from './BlockScene';
import {gameModel, gameResultScene, mixesDisplayScene, pointsDisplayScene, turnsDisplayScene} from '../index';
import delay from '../utils/delay';
import comparePositions from '../utils/comparePositions';

export default class FieldScene implements IBaseComponent {
	private readonly app: Application;
	private sprite: Sprite;
	private state: GameModel;
	private readonly startX: number;
	private readonly startY: number;
	private blocks: BlockScene[] = [];
 
	constructor(app: Application, state: GameModel) {
		this.app = app;
		this.state = state;
		this.startY = (this.app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE;
		this.startX = (this.app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE;
	}
	
	private disableField(flag: boolean) {
		document.getElementById('app').style.pointerEvents = flag ? 'none' : 'all';
	}
 
	private async reGenerateField(afterMix = false) {
		if (!afterMix) {
			gameModel.generateBlocks();
		}
		await this.reRender();
	}
 
	private reRenderAllTheDisplays() {
		pointsDisplayScene.reRender();
		turnsDisplayScene.reRender();
		mixesDisplayScene.reRender();
	}
 
	private removeBlocks(blocksToBeRemoved: IBlock[]) {
		blocksToBeRemoved.forEach((block) => {
			const found = this.blocks.find(b =>
				comparePositions(b.properties.position, block.position)
			);
			if (found) {
				found.destroy();
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
					await found.move(block.target);
				}
    
				return found;
			})
		);
	}
	
	private addBlocks(blocksToBeAdded: IBlock[]) {
		return Promise.all(
			blocksToBeAdded.map(async (block) => {
				const blockScene = new BlockScene(
					JSON.parse(JSON.stringify(block)),
					this.app,
					this.onBlockClick.bind(this));
				await blockScene.render();
				this.blocks.push(blockScene);
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
				mixesDisplayScene.reRender();
				gameResultScene.render(gameStatus);
				return;
			}
			if (gameStatus === 'loss' || gameStatus === 'win') {
				gameResultScene.render(gameStatus);
				await this.reGenerateField();
				return;
			}
			// await this.reRender();
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
	}
 
	public async reRender() {
		this.destroy();
		await this.renderBlocks();
	}
 
	private async renderBlocks() {
		return Promise.all(
			this.state.blocks.map(async (block) => {
				const component = new BlockScene(
					JSON.parse(JSON.stringify(block)),
					this.app,
					this.onBlockClick.bind(this));
				await component.render();
				this.blocks.push(component);
				return block;
			})
		);
	}
 
	public async render() {
		const image = new Image(FIELD_SIZE, FIELD_SIZE);
		image.src = FieldImage;
		const texture = await Assets.load(image.src);
		this.sprite = new Sprite(texture);
		this.sprite.width = FIELD_SIZE;
		this.sprite.height = FIELD_SIZE;
  
		this.sprite.x = this.app.renderer.width / 2;
		this.sprite.y = this.app.renderer.height / 2;
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.app.stage.addChild(this.sprite);
  
		await this.renderBlocks();
	}
}
