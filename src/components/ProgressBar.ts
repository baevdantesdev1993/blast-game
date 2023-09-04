import {Graphics} from 'pixi.js';
import {IRenderParams} from '../interfaces';
import {GREY_COLOR} from '../constants';
import {Align} from '../types';

export interface IProgressBarParams extends IRenderParams {
  align: Align,
  color: string,
  filledPercent: number
}

export default class ProgressBar extends Graphics {
	align: Align = 'left';
	filledPercent: number;
	color: string;
	progressBarWidth: number;
	progressBarHeight: number;
 
	constructor(params: IProgressBarParams) {
		super();
		this.x = params.position.x;
		this.y = params.position.y;
		this.progressBarWidth = params.width;
		this.progressBarHeight = params.height;
		this.color = params.color;
		this.filledPercent = params.filledPercent;
		this.align = params.align;
		this.create();
	}
 
	private drawProgressBar(filled = false) {
		this.beginFill(filled ? this.color : GREY_COLOR);
		this.drawRect(0,
			0,
			filled ? this.progressBarWidth * (this.filledPercent) : this.progressBarWidth,
			this.progressBarHeight);
		if (this.align === 'right') {
			if (filled) {
				this.x = this.x - this.progressBarWidth;
			}
		}
		this.endFill();
	}
 
	private create() {
		this.drawProgressBar();
		this.drawProgressBar(true);
	}
}
