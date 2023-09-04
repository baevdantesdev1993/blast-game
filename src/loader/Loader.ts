import {Assets, Texture} from 'pixi.js';
import blocksMap, {BlockColor} from '../utils/blocksMap';
import FieldImage from '../assets/field.png';

interface ILoaderParams {
	blockSize: number,
	fieldSize: number
}

export default class Loader {
	private blocks: Record<BlockColor, Texture>;
	private field: Texture;
	private readonly blockSize: number;
	private readonly fieldSize: number;
 
	constructor(params: ILoaderParams) {
		this.blockSize = params.blockSize;
		this.fieldSize = params.fieldSize;
	}
	
	public get blocksTextures() {
		return this.blocks;
	}
	
	public get fieldTexture() {
		return this.field;
	}
	
	async loadBlocks(): Promise<Record<BlockColor, Texture>> {
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
	
	async loadField(): Promise<Texture> {
		const image = new Image(this.fieldSize, this.fieldSize);
		image.src = FieldImage;
		const texture: Texture = await Assets.load(image.src);
		this.field = texture;
		return texture;
	}
	
	async init() {
		await Promise.all([
			this.loadField(),
			this.loadBlocks(),
		]);
	}
}
