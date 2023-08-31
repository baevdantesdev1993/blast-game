import {IBaseComponent} from '../interfaces';
import FieldImage from '../assets/field.png';
import {BLOCK_SIZE, FIELD_PADDING, FIELD_SIZE} from '../constants';
import {Application, Assets, Sprite} from 'pixi.js';
import {GameModel} from '../models/GameModel';
import BlockScene from './BlockScene';
import {gameModel, gameResultScene, mixesDisplayScene, pointsDisplayScene, turnsDisplayScene} from '../index';

export default class FieldScene implements IBaseComponent {
	private readonly app: Application;
	private object: Sprite;
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
 
	private async reGenerateField(afterMix = false) {
		if (!afterMix) {
			gameModel.generateBlocks();
		}
		await this.reRender();
	}
 
	public async onBlockClick(block: BlockScene) {
		try {
			const res = gameModel.onBlockClick(block.block);
			if (res === 'mix') {
				await this.reGenerateField(true);
				mixesDisplayScene.reRender();
				gameResultScene.render(res);
				return;
			}
			if (res === 'loss' || res === 'win') {
				gameResultScene.render(res);
				await this.reGenerateField();
				return;
			}
			await this.reRender();
		} catch (e) {
			console.error(e);
		} finally {
			pointsDisplayScene.reRender();
			turnsDisplayScene.reRender();
			mixesDisplayScene.reRender();
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
 
	private renderBlocks() {
		this.state.blocksList.forEach(async (item) => {
			const component = new BlockScene(item, this.app, this.onBlockClick.bind(this));
			await component.render();
			this.blocks.push(component);
		});
	}
 
	public async render() {
		const image = new Image(FIELD_SIZE, FIELD_SIZE);
		image.src = FieldImage;
		const texture = await Assets.load(image.src);
		this.object = new Sprite(texture);
		this.object.width = FIELD_SIZE;
		this.object.height = FIELD_SIZE;
  
		this.object.x = this.app.renderer.width / 2;
		this.object.y = this.app.renderer.height / 2;
		this.object.anchor.x = 0.5;
		this.object.anchor.y = 0.5;
		this.app.stage.addChild(this.object);
  
		this.renderBlocks();
	}
}
