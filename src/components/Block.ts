import {IBlock, IPosition, IRenderParams} from '../interfaces';
import {Sprite} from 'pixi.js';
import {loader} from '../index';
import AnimationService from '../services/AnimationService';

interface IBlockParams extends IRenderParams {
  block: IBlock,
  onClickCallBack: (block: Block) => void
}

export default class Block extends Sprite {
	private readonly props: IBlock;
	private readonly onClickCallback: (block: Block) => void;
	private animationService: AnimationService;
 
	public get properties() {
		return this.props;
	}
 
	constructor(params: IBlockParams) {
		super();
		this.animationService = new AnimationService();
		this.props = params.block;
		this.x = params.position.x;
		this.y = params.position.y;
		this.onClickCallback = params.onClickCallBack;
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('click', this.onClick, this);
		this.on('touchend', this.onClick, this);
		this.on('pointerover', this.onPointerOver, this);
		this.on('pointerleave', this.onPointerLeave, this);
		this.on('mousedown', this.onMouseDown, this);
		this.on('mouseup', this.onMouseUp, this);
		this.width = params.width;
		this.height = params.height;
		if (this.props.superBoost) {
			this.tint = 0x6b6b6b;
		}
		this.create();
	}
 
	public async remove() {
		await this.animationService.removeBlock(this);
		this.destroy();
	}
 
	private setPosition(position: IPosition) {
		this.props.position = position;
	}
 
	public async moveTo(position: IPosition, realPosition: IPosition) {
		this.setPosition(position);
		await this.animationService.moveBlockToTheBottom(this, realPosition);
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
 
	public create() {
		this.texture = loader.blocksTextures[this.props.color];
	}
}
