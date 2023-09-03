import blocksMap from '../utils/blocksMap';
import {IBlock, IPosition, IRenderParams} from '../interfaces';
import {Assets, Sprite} from 'pixi.js';

interface IBlockSceneParams extends IRenderParams {
  block: IBlock,
  onClickCallBack: (block: BlockScene) => void
}

export default class BlockScene extends Sprite {
	private readonly props: IBlock;
	private readonly image: HTMLImageElement;
	private readonly onClickCallback: (block: BlockScene) => void;
 
	public get properties() {
		return this.props;
	}
	
	public setPosition(pos: IPosition, realPos: IPosition) {
		this.props.position = pos;
		this.x = realPos.x;
		this.y = realPos.y;
	}
 
	constructor(params: IBlockSceneParams) {
		super();
		this.image = new Image(params.width, params.height);
		this.image.src = blocksMap[params.block.color];
		this.props = params.block;
		this.x = params.position.x;
		this.y = params.position.y;
		this.onClickCallback = params.onClickCallBack;
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('click', this.onClick, this);
		this.on('pointerover', this.onPointerOver, this);
		this.on('pointerleave', this.onPointerLeave, this);
		this.on('mousedown', this.onMouseDown, this);
		this.on('mouseup', this.onMouseUp, this);
		this.width = params.width;
		this.height = params.height;
		if (this.props.superBoost) {
			this.tint = 0x6b6b6b;
		}
	}
 
	public async move(position: IPosition) {
		// this.remove();
		// this.props.position = position;
		// await this.create();
	}
 
	public async create() {
		this.texture = await Assets.load(this.image.src);
	}
 
	private onClick() {
		this.onClickCallback(this);
	}
 
	private onMouseDown() {
		this.alpha = 0.5;
	}
 
	private onMouseUp() {
		this.alpha = 0.8;
	}
 
	private onPointerOver() {
		this.alpha = 0.8;
	}
 
	private onPointerLeave() {
		this.alpha = 1;
	}
}
