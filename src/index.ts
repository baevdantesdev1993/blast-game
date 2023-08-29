import {Application, Sprite} from "pixi.js";
import FieldComponent from "./components/FieldComponent";
import {StateService} from "./services/StateService";
import {BLOCKS_QUANTITY} from "./constants";
import GameResult from "./components/GameResult";
import PointsDisplay from "./components/PointsDisplay";
import TurnsDisplay from "./components/TurnsDisplay";


export const app = new Application<HTMLCanvasElement>({
  background: '#bebebe',
  resizeTo: window,
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('app').appendChild(app.view);
}, false);

export const state = new StateService(BLOCKS_QUANTITY)
let blockInstances: Sprite[] = [];

export const pointsDisplayInstance = new PointsDisplay(app)
export const turnsDisplayInstance = new TurnsDisplay(app)
const mainFieldInstance = new FieldComponent(app, state)

export const gameResult = new GameResult(app)

export const renderResult = (success: boolean) => {
  gameResult.render(success)
}

export const renderApp = async (reRender = false) => {
  if (reRender) {
    await mainFieldInstance.reRender()
    pointsDisplayInstance.reRender()
    turnsDisplayInstance.reRender()
  } else {
    await mainFieldInstance.render()
    pointsDisplayInstance.render()
    turnsDisplayInstance.render()
  }
};

renderApp();
