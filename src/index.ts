import {Application} from 'pixi.js';
import MainScene from './scenes/MainScene';
import {GameModel} from './models/GameModel';
import {BLOCK_SIZE, BLOCKS_QUANTITY, FIELD_SIZE} from './constants';
import LoaderService from './services/LoaderService';

export const app = new Application<HTMLCanvasElement>({
	background: '#bebebe',
	resizeTo: window,
});

window.onload = () => document.getElementById('app').appendChild(app.view);

export const gameModel = new GameModel(BLOCKS_QUANTITY);
export const loaderService = new LoaderService(
	{
		blockSize: BLOCK_SIZE,
		fieldSize: FIELD_SIZE
	}
);
const mainView = new MainScene();
export const renderApp = (reRender = false) => {
	if (reRender) {
		mainView.reCreate();
		return;
	}
 
	mainView.create();
};

const init = async () => {
	await loaderService.init();
	renderApp();
};

init();
