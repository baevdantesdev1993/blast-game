import {Container, Graphics, Text} from 'pixi.js';
import {gameModel} from '../index';
import {GREY_COLOR, MAX_MIXES, MAX_TURNS, PROGRESS_BAR_WIDTH, RED_COLOR} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';

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
 
	private drawProgressBar(filled = false) {
		this.progressBar = new Graphics();
		this.progressBar.beginFill(filled ? RED_COLOR : GREY_COLOR);
		this.progressBar.drawRect(0,
			30,
			filled ? PROGRESS_BAR_WIDTH * ((gameModel.mixes / MAX_MIXES)) : PROGRESS_BAR_WIDTH,
			20);
		if (this.align === 'right') {
			if (filled) {
				this.progressBar.x = this.progressBar.x - this.progressBar.width
          - (PROGRESS_BAR_WIDTH - PROGRESS_BAR_WIDTH * ((gameModel.turns / MAX_TURNS)));
			} else {
				this.progressBar.x = this.progressBar.x - this.progressBar.width;
			}
		}
		this.progressBar.endFill();
		this.addChild(this.progressBar);
	}
 
	private renderText() {
		this.text = new Text(`Mixes: ${gameModel.mixes}/${MAX_MIXES}`);
		if (this.align === 'right') {
			this.text.x = this.text.x - this.text.width;
		}
		this.addChild(this.text);
	}
 
	public create() {
		this.renderText();
		this.drawProgressBar();
		this.drawProgressBar(true);
	}
}
