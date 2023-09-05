import {Container, Graphics, Text} from 'pixi.js';
import {app, displayFontStyleValue, gameModel, progressbarWidthValue} from '../index';
import {GREEN_COLOR, MOBILE_BREAKPOINT, WIN_POINTS} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';
import ProgressBar from './ProgressBar';

export default class PointsDisplay extends Container {
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
		this.text = new Text(`Points: ${gameModel.points}/${WIN_POINTS}`);
		this.text.style = displayFontStyleValue;
		if (this.align === 'right') {
			this.text.x = this.text.x - this.text.width;
		}
		this.addChild(this.text);
	}
  
	private renderProgressBar() {
		this.progressBar = new ProgressBar({
			width: progressbarWidthValue,
			height: 20,
			position: {
				x: 0,
				y: app.renderer.width <= MOBILE_BREAKPOINT ? 22 : 35
			},
			align: 'left',
			color: GREEN_COLOR,
			filledPercent: (gameModel.points / WIN_POINTS)
		});
		this.addChild(this.progressBar);
	}
  
	private create() {
		this.renderText();
		this.renderProgressBar();
	}
}
