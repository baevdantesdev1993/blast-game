import {IScene} from '../interfaces';
import Loading from '../scenes/Loading';
import Main from '../scenes/Main';

type sceneType = 'loading' | 'main'

export default class SceneService {
	private currentScene: IScene = null;
	private scenesMap: Record<sceneType, () => Promise<IScene>> = {
		loading: async () => new Loading(),
		main: async () => {
			const scene = new Main();
			await scene.init();
			return scene;
		}
	};
  
	public async goTo(scene: sceneType) {
		if (this.currentScene) {
			this.currentScene.destroy();
		}
		this.currentScene = await this.scenesMap[scene]();
	}
}
