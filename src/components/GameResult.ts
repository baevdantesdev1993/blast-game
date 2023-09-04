import {Text, TextStyle} from 'pixi.js';
import {GREEN_COLOR, RED_COLOR} from '../constants';
import {GameStatus} from '../types';
import {IRenderParams} from '../interfaces';

export default class GameResult extends Text {
	params: IRenderParams;
 
	constructor(params: IRenderParams) {
		super();
		this.params = params;
		this.y = params.position.y;
	}
 
	public create(gameStatus: GameStatus) {
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
		this.text = statusMap[gameStatus];
		this.x = this.params.position.x - this.width / 2;
		this.style = style;
	}
}
