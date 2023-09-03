import {Application} from 'pixi.js';
import MainView from './views/MainView';
import {GameModel} from './models/GameModel';
import {BLOCKS_QUANTITY} from './constants';

export const app = new Application<HTMLCanvasElement>({
	background: '#bebebe',
	resizeTo: window,
});

window.onload = () => document.getElementById('app').appendChild(app.view);

export const gameModel = new GameModel(BLOCKS_QUANTITY);
const mainView = new MainView();

export const renderApp = async (reRender = false) => {
	if (reRender) {
		await mainView.reCreate();
		return;
	}
  
	await mainView.create();
};

renderApp();
