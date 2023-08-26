import {Application} from "pixi.js";


const app = new Application<HTMLCanvasElement>({
  background: '#bebebe',
  resizeTo: window
});

document.getElementById('app').appendChild(app.view)
