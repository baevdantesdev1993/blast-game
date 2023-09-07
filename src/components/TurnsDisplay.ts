import {Container, Graphics, Text} from 'pixi.js';
import {app, displayFontStyleValue, gameModel, progressbarWidthValue} from '../index';
import {MAX_TURNS, MOBILE_BREAKPOINT, ALARM_COLOR} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';
import ProgressBar from './ProgressBar';

export default class TurnsDisplay extends Container {
	private text: Text;
	private progressBar: Graphics;
	private align: Align = 'left';
 
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
 
	private renderProgressBar() {
		this.progressBar = new ProgressBar({
			width: progressbarWidthValue,
			height: 20,
			position: {
				x: 0,
				y: app.renderer.width <= MOBILE_BREAKPOINT ? 22 : 35
			},
			align: 'right',
			color: ALARM_COLOR,
			filledPercent: (gameModel.turns / MAX_TURNS)
		});
		this.addChild(this.progressBar);
	}
 
	private renderText() {
		this.text = new Text(`Turns: ${gameModel.turns}/${MAX_TURNS}`);
		this.text.style = displayFontStyleValue;
		if (this.align === 'right') {
			this.text.x = this.text.x - this.text.width;
		}
		this.addChild(this.text);
	}
 
	public create() {
		this.renderText();
		this.renderProgressBar();
	}
}
