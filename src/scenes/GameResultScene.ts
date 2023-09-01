import {IBaseComponent} from '../interfaces';
import {Application, Text, TextStyle} from 'pixi.js';
import {GREEN_COLOR, PADDING_TOP, RED_COLOR} from '../constants';
import {GameStatus} from '../types';

export default class GameResultScene implements IBaseComponent {
	private app: Application;
	private text: Text;
	private timeout: NodeJS.Timeout;
  
	constructor(app: Application) {
		this.app = app;
	}
  
	public destroy() {
		this.text.destroy();
	}
  
	public reRender(gameStatus: GameStatus) {
		this.destroy();
		this.render(gameStatus);
	}
  
	public render(gameStatus: GameStatus) {
		clearTimeout(this.timeout);
		const style = new TextStyle({
			fill: gameStatus === 'win' || gameStatus === 'mix'
				? GREEN_COLOR : RED_COLOR
		});
		const statusMap: Record<GameStatus, string> = {
			win: 'Win!',
			mix: 'Mixed',
			loss: 'Loss :-(',
			progress: ''
		};
		this.text = new Text(statusMap[gameStatus]);
		this.text.x = this.app.renderer.width / 2 - this.text.width / 2;
		this.text.y = PADDING_TOP;
		this.text.style = style;
		this.app.stage.addChild(this.text);
		this.timeout = setTimeout(() => {
			this.destroy();
		}, 3000);
	}
}
