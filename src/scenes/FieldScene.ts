import {IRenderParams} from '../interfaces';
import {FIELD_SIZE} from '../constants';
import FieldImage from '../assets/field.png';
import {Assets, Sprite} from 'pixi.js';

export default class FieldScene extends Sprite {
	xAnchor: number;
	yAnchor: number;
 
	constructor(renderParams: IRenderParams) {
		super();
		this.x = renderParams.position.x;
		this.y = renderParams.position.y;
		this.xAnchor = renderParams.anchor.x;
		this.yAnchor = renderParams.anchor.y;
		this.width = renderParams.width;
		this.height = renderParams.height;
		this.anchor.x = this.xAnchor;
		this.anchor.y = this.yAnchor;
	}
 
	async create() {
		const image = new Image(FIELD_SIZE, FIELD_SIZE);
		image.src = FieldImage;
		this.texture = await Assets.load(image.src);
	}
}
