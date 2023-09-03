import {Container, Graphics, Text} from 'pixi.js';
import {gameModel} from '../index';
import {MAX_MIXES, PROGRESS_BAR_WIDTH, RED_COLOR} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';
import ProgressBarScene from './ProgressBarScene';

export default class MixesDisplayScene extends Container {
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
		this.destroy();
		this.create();
	}
 
	public destroy() {
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
		this.progressBar = new ProgressBarScene({
			width: PROGRESS_BAR_WIDTH,
			height: 20,
			position: {
				x: 0,
				y: 20
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
