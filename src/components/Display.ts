import {Container, Graphics, Text} from 'pixi.js';
import {app, displayFontStyleValue, progressbarWidthValue} from '../index';
import {MOBILE_BREAKPOINT} from '../constants';
import {IRenderParams} from '../interfaces';
import {Align} from '../types';
import ProgressBar from './ProgressBar';

interface IDisplayParams extends IRenderParams {
  align: Align,
  content: string,
  color: string,
  filledPercent: number
}

export default class Display extends Container {
	private text: Text;
	private progressBar: Graphics;
	private params: IDisplayParams;
 
	constructor(params: IDisplayParams) {
		super();
		this.params = params;
		this.x = params.position.x;
		this.y = params.position.y;
		this.create();
	}
 
	public update(params: Pick<IDisplayParams, 'content' | 'filledPercent'>) {
		this.params.content = params.content;
		this.params.filledPercent = params.filledPercent;
		this.renderText(true);
		this.renderProgressBar();
	}
 
	public reCreate() {
		this.remove();
		this.create();
	}
 
	public remove() {
		this.removeChild(this.text);
		this.removeChild(this.progressBar);
	}
 
	private renderText(reRender = false) {
		if (reRender) {
			this.text.destroy();
		}
		this.text = new Text(this.params.content);
		this.text.style = displayFontStyleValue;
		if (this.params.align === 'right') {
			this.text.x = this.text.x - this.text.width;
		}
		this.addChild(this.text);
	}
 
	private renderProgressBar(reRender = false) {
		if (reRender) {
			this.progressBar.destroy();
		}
		this.progressBar = new ProgressBar({
			width: progressbarWidthValue,
			height: 20,
			position: {
				x: 0,
				y: app.renderer.width <= MOBILE_BREAKPOINT ? 22 : 35
			},
			align: this.params.align,
			color: this.params.color,
			filledPercent: this.params.filledPercent
		});
		this.addChild(this.progressBar);
	}
 
	private create() {
		this.renderText();
		this.renderProgressBar();
	}
}
