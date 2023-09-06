import {Application} from 'pixi.js';
import MainScene from './scenes/MainScene';
import {GameModel} from './models/GameModel';
import {BLOCKS_QUANTITY} from './constants';
import LoaderService from './services/LoaderService';

export const app = new Application<HTMLCanvasElement>({
	background: '#bebebe',
	resizeTo: window,
});

window.onload = () => document.getElementById('app').appendChild(app.view);

export const gameModel = new GameModel(BLOCKS_QUANTITY);
export const loaderService = new LoaderService();
const mainView = new MainScene();
const renderApp = () => {
	mainView.create();
};

const init = async () => {
	await loaderService.init();
	renderApp();
};

init();

export const {
	blockSizeVal,
	fieldSizeVal,
	progressbarWidthValue,
	displayFontStyleValue
} = loaderService;
