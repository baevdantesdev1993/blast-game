import {Application, Sprite, Text} from "pixi.js";
import FieldComponent from "./components/FieldComponent";
import BlockComponent from "./components/BlockComponent";
import {StateService} from "./services/StateService";
import {BLOCK_SIZE, BLOCKS_QUANTITY, FIELD_PADDING, FIELD_SIZE} from "./constants";
import PointsDisplay from "./components/PointsDisplay";
import TurnsDisplay from "./components/TurnsDisplay";


export const app = new Application<HTMLCanvasElement>({
  background: '#bebebe',
  resizeTo: window,
});

document.getElementById('app').appendChild(app.view);

export const state = new StateService(BLOCKS_QUANTITY)
let pointerDisplayInstance: Text;
let turnsDisplayInstance: Text;
let blockInstances: Sprite[] = [];
const setPointsDisplayInstance = () => {
  pointerDisplayInstance = new PointsDisplay(app).render();
}

const setTurnsDisplayInstance = () => {
  turnsDisplayInstance = new TurnsDisplay(app).render();
}

const setBlockInstances = (blocks: BlockComponent[]) => {
  blocks.forEach(async (b) => {
    const renderBlock = await b.render();
    renderBlock.x = startX + (b.block.position.x * BLOCK_SIZE)
    renderBlock.y = startY + (b.block.position.y * BLOCK_SIZE)
    app.stage.addChild(renderBlock);
    blockInstances.push(renderBlock)
  })
}

const destroyBlockInstances = () => {
  blockInstances.forEach((b) => b.destroy())
  blockInstances = []
}

const startX = (app.renderer.width / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE
const startY = (app.renderer.height / 2) - FIELD_SIZE / 2 + FIELD_PADDING - BLOCK_SIZE

export const renderTurnsDisplay = (reRender = false) => {
  if (reRender) {
    turnsDisplayInstance.destroy()
  }
  
  setTurnsDisplayInstance()
  
  app.stage.addChild(turnsDisplayInstance)
}

export const renderApp = async (reRender = false) => {
  const mainFieldSprite = await new FieldComponent().render()
  mainFieldSprite.x = app.renderer.width / 2;
  mainFieldSprite.y = app.renderer.height / 2;
  mainFieldSprite.anchor.x = 0.5;
  mainFieldSprite.anchor.y = 0.5;
  app.stage.addChild(mainFieldSprite);
  
  const blocks: BlockComponent[] = state.blocksList.map((b) => new BlockComponent(b))
  
  renderTurnsDisplay(reRender)
  
  if (reRender) {
    pointerDisplayInstance.destroy()
    destroyBlockInstances()
  }
  setPointsDisplayInstance()
  setBlockInstances(blocks)
  app.stage.addChild(pointerDisplayInstance)
};

renderApp();
