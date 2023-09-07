import {Container, Text} from 'pixi.js';
import {app} from '../index';
import {IScene} from '../interfaces';
import {PRIMARY_COLOR} from '../constants';

export default class Loading extends Container implements IScene {
	constructor() {
		super();
		const text = new Text('Loading...');
		text.style.fontSize = 36;
		text.style.fill = PRIMARY_COLOR;
		text.x = app.renderer.width / 2;
		text.y = app.renderer.height / 2;
		text.anchor.set(0.5, 0.5);
		this.addChild(text);
		this.init();
	}
 
	public init() {
		app.stage.addChild(this);
	}
}
