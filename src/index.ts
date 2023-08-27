import {Application} from "pixi.js";
import FieldComponent from "./components/FieldComponent";
import MainFieldComponent from "./components/MainFieldComponent";
import BlockComponent from "./components/BlockComponent";
import {StateService} from "./services/StateService";
import {BLOCKS_QUANTITY} from "./constants";


export const app = new Application<HTMLCanvasElement>({
  background: '#bebebe',
  resizeTo: window
});

document.getElementById('app').appendChild(app.view);

export const state = new StateService(BLOCKS_QUANTITY, app)

export const renderMainField = async () => {
  await new MainFieldComponent(
    new FieldComponent(),
    state.blocksList.map((b) => new BlockComponent(b)),
    app).render()
}

renderMainField()
