import {Assets, TextStyle, Texture} from 'pixi.js';
import blocksMap, {BlockColor} from '../utils/blocksMap';
import FieldImage from '../assets/field.png';
import {app} from '../index';
import {BLOCKS_IN_COLUMN, COMMON_PADDING, FIELD_PADDING, MAX_FIELD_SIZE, MOBILE_BREAKPOINT} from '../constants';

export default class LoaderService {
	private blocks: Record<BlockColor, Texture>;
	private field: Texture;
	private progressbarWidth: number;
	private blockSize: number;
	private fieldSize: number;
	private displayFontStyle: TextStyle;
 
	public get blocksTextures() {
		return this.blocks;
	}
 
	public get fieldSizeVal() {
		return this.fieldSize;
	}
	
	public get displayFontStyleValue() {
		return this.displayFontStyle;
	}
	
	public get progressbarWidthValue() {
		return this.progressbarWidth;
	}
 
	public get blockSizeVal() {
		return this.blockSize;
	}
 
	public get fieldTexture() {
		return this.field;
	}
 
	private async loadBlocks(): Promise<Record<BlockColor, Texture>> {
		const mapped = await Promise.all(
			Object.keys(blocksMap).map(async (key: BlockColor) => {
				const image = new Image(this.blockSize, this.blockSize);
				image.src = blocksMap[key];
				const texture: Texture = await Assets.load(image.src);
				return {[key]: texture};
			})
		);
		this.blocks = Object.assign({}, ...mapped);
		return Object.assign({}, ...mapped);
	}
 
	private async loadField(): Promise<Texture> {
		const image = new Image(this.fieldSize, this.fieldSize);
		image.src = FieldImage;
		const texture: Texture = await Assets.load(image.src);
		this.field = texture;
		return texture;
	}
 
	private initSizes() {
		this.fieldSize = app.renderer.width >= MAX_FIELD_SIZE
			? MAX_FIELD_SIZE - (COMMON_PADDING * 2)
			: app.renderer.width - (COMMON_PADDING * 2);
		this.blockSize = (this.fieldSize - FIELD_PADDING * 2) / BLOCKS_IN_COLUMN;
		if (app.renderer.width <= MOBILE_BREAKPOINT) {
			this.progressbarWidth = 140;
			this.displayFontStyle = new TextStyle({
				fontSize: 20
			});
		} else {
			this.progressbarWidth = 200;
			this.displayFontStyle = new TextStyle({
				fontSize: 24
			});
		}
	}
 
	async init() {
		this.initSizes();
		await Promise.all([
			this.loadField(),
			this.loadBlocks(),
		]);
	}
}
