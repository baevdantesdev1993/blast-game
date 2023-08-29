import {Application, Sprite} from "pixi.js";
import FieldComponent from "./components/FieldComponent";
import BlockComponent from "./components/BlockComponent";
import {StateService} from "./services/StateService";
import {BLOCK_SIZE, BLOCKS_QUANTITY, FIELD_PADDING, FIELD_SIZE} from "./constants";
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

export const gameResult = new GameResult(app)

export const renderResult = (success: boolean) => {
  gameResult.render(success)
}

export const renderApp = async (reRender = false) => {
  const mainFieldSprite = await new FieldComponent().render()
  mainFieldSprite.x = app.renderer.width / 2;
  mainFieldSprite.y = app.renderer.height / 2;
  mainFieldSprite.anchor.x = 0.5;
  mainFieldSprite.anchor.y = 0.5;
  app.stage.addChild(mainFieldSprite);
  
  const blocks: BlockComponent[] = state.blocksList.map((b) => new BlockComponent(b))
  
  if (reRender) {
    pointsDisplayInstance.reRender()
    turnsDisplayInstance.reRender()
    destroyBlockInstances()
  } else {
    pointsDisplayInstance.render()
    turnsDisplayInstance.render()
  }
  setBlockInstances(blocks)
};

renderApp();
