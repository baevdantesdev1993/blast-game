import {Application} from 'pixi.js';
import FieldScene from './scenes/FieldScene';
import {GameModel} from './models/GameModel';
import {BLOCKS_QUANTITY} from './constants';
import GameResultScene from './scenes/GameResultScene';
import PointsDisplayScene from './scenes/PointsDisplayScene';
import TurnsDisplayScene from './scenes/TurnsDisplayScene';
import MixesDisplayScene from './scenes/MixesDisplayScene';


export const app = new Application<HTMLCanvasElement>({
	background: '#bebebe',
	resizeTo: window,
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('app').appendChild(app.view);
}, false);

export const gameModel = new GameModel(BLOCKS_QUANTITY);
export const pointsDisplayScene = new PointsDisplayScene(app);
export const turnsDisplayScene = new TurnsDisplayScene(app);
export const mixesDisplayScene = new MixesDisplayScene(app);
const mainField = new FieldScene(app, gameModel);

export const gameResultScene = new GameResultScene(app);

export const renderApp = async (reRender = false) => {
	if (reRender) {
		await mainField.reRender();
		pointsDisplayScene.reRender();
		turnsDisplayScene.reRender();
		mixesDisplayScene.reRender();
    
		return;
	}
  
	await mainField.render();
	pointsDisplayScene.render();
	turnsDisplayScene.render();
	mixesDisplayScene.render();
};

renderApp();
