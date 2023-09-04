import {IRenderParams} from '../interfaces';
import {Sprite} from 'pixi.js';
import {loader} from '../index';


export default class Field extends Sprite {
	constructor(renderParams: IRenderParams) {
		super();
		this.x = renderParams.position.x;
		this.y = renderParams.position.y;
		this.width = renderParams.width;
		this.height = renderParams.height;
		this.anchor.x = renderParams.anchor.x;
		this.anchor.y = renderParams.anchor.y;
		this.texture = loader.fieldTexture;
	}
}
