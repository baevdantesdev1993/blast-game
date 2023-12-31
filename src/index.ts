import {Application} from 'pixi.js';
import {GameModel} from './models/GameModel';
import {BLOCKS_QUANTITY} from './constants';
import LoaderService from './services/LoaderService';
import SceneService from './services/SceneService';
import delay from './utils/delay';

export const app = new Application<HTMLCanvasElement>({
	background: '#bebebe',
	resizeTo: window,
});

window.onload = () => document.getElementById('app').appendChild(app.view);
export const sceneService = new SceneService();

export const gameModel = new GameModel(BLOCKS_QUANTITY);
export const loaderService = new LoaderService();

const init = async () => {
	sceneService.goTo('loading');
	await loaderService.init();
	await delay(300);
	await sceneService.goTo('main');
};

init();

export const {
	blockSizeVal,
	fieldSizeVal,
	progressbarWidthValue,
	displayFontStyleValue
} = loaderService;
