import {IBlock, IPosition, IRenderParams} from '../interfaces';
import {Sprite, Texture} from 'pixi.js';
import {loader} from '../index';

interface IBlockParams extends IRenderParams {
  block: IBlock,
  onClickCallBack: (block: Block) => void
  animationTextures: Texture[]
}

export default class Block extends Sprite {
	private readonly props: IBlock;
	private readonly onClickCallback: (block: Block) => void;
 
	public get properties() {
		return this.props;
	}
 
	constructor(params: IBlockParams) {
		super();
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
 
	public remove() {
		this.destroy();
	}
 
	public moveTo(position: IPosition, realPosition: IPosition) {
		const size = {
			width: this.width,
			height: this.height
		};
		this.props.position = position;
		this.setTransform(realPosition.x, realPosition.y);
		this.width = size.width;
		this.height = size.height;
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
 
	private create() {
		this.texture = loader.blocksTextures[this.props.color];
	}
}
