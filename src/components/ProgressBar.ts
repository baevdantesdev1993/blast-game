import {Container, Graphics} from 'pixi.js';
import {IRenderParams} from '../interfaces';
import {GREY_COLOR} from '../constants';
import {Align} from '../types';
import AnimationService from '../services/AnimationService';

export interface IProgressBarParams extends IRenderParams {
  align: Align,
  color: string,
  filledPercent: number
}

export default class ProgressBar extends Container {
	private readonly align: Align = 'left';
	private filledPercent: number;
	private readonly color: string;
	private readonly progressBarWidth: number;
	private readonly progressBarHeight: number;
	private animationService: AnimationService;
	private backgroundBar: Graphics = new Graphics();
	private progressBar: Graphics = new Graphics();
 
	constructor(params: IProgressBarParams) {
		super();
		this.x = params.position.x;
		this.y = params.position.y;
		this.progressBarWidth = params.width;
		this.progressBarHeight = params.height;
		this.color = params.color;
		this.filledPercent = params.filledPercent;
		this.align = params.align;
		this.animationService = new AnimationService();
		this.create();
	}
 
	public async update(percent: number) {
		this.filledPercent = percent;
		this.progressBar.width = this.backgroundBar.width * this.filledPercent;
	}
 
	private drawProgressBar(filled = false) {
		if (!filled) {
			this.backgroundBar.beginFill(GREY_COLOR);
			this.backgroundBar.drawRect(0,
				0,
				this.progressBarWidth,
				this.progressBarHeight);
			this.backgroundBar.endFill();
			this.addChild(this.backgroundBar);
		} else {
			this.progressBar.beginFill(this.color);
			this.progressBar.drawRect(0,
				0,
				this.progressBarWidth * (this.filledPercent),
				this.progressBarHeight);
			this.progressBar.endFill();
			this.addChild(this.progressBar);
		}
	}
 
	private create() {
		if (this.align === 'right') {
			this.x = this.x - this.progressBarWidth;
		}
		this.drawProgressBar();
		this.drawProgressBar(true);
	}
}
