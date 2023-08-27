import {Application} from "pixi.js";
import FieldComponent from "./components/FieldComponent";
import MainFieldComponent from "./components/MainFieldComponent";
import BlockComponent from "./components/BlockComponent";
import state from "./services/StateService";


const app = new Application<HTMLCanvasElement>({
  background: '#bebebe',
  resizeTo: window
});

document.getElementById('app').appendChild(app.view);

(async () => {
  await new MainFieldComponent(
    new FieldComponent(),
    state.blocksList.map((b) =>  new BlockComponent(b, state)),
    app).render()
})();
