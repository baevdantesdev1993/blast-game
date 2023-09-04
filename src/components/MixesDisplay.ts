import {Container, Graphics, Text} from 'pixi.js';
import {gameModel} from '../index';
import {MAX_MIXES, PROGRESS_BAR_WIDTH, RED_COLOR} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';
import ProgressBar from './ProgressBar';

export default class MixesDisplay extends Container {
	private text: Text;
	private progressBar: Graphics;
	private readonly align: Align = 'left';
 
	constructor(params: IRenderParams, align: Align = 'left') {
		super();
		this.align = align;
		this.x = params.position.x;
		this.y = params.position.y;
		this.create();
	}
 
	public reCreate() {
		this.remove();
		this.create();
	}
 
	public remove() {
		this.removeChild(this.text);
		this.removeChild(this.progressBar);
	}
 
	private renderText() {
		this.text = new Text(`Mixes: ${gameModel.mixes}/${MAX_MIXES}`);
		if (this.align === 'right') {
			this.text.x = this.text.x - this.text.width;
		}
		this.addChild(this.text);
	}
 
	private renderProgressBar() {
		this.progressBar = new ProgressBar({
			width: PROGRESS_BAR_WIDTH,
			height: 20,
			position: {
				x: 0,
				y: 35
			},
			align: 'left',
			color: RED_COLOR,
			filledPercent: (gameModel.mixes / MAX_MIXES)
		});
		this.addChild(this.progressBar);
	}
 
	public create() {
		this.renderText();
		this.renderProgressBar();
	}
}
