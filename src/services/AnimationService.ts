import Block from '../components/Block';
import {IPosition} from '../interfaces';

export default class AnimationService {
	public async moveBlockToTheBottom(block: Block, position: IPosition, duration = 400) {
		return new Promise<void>((res) => {
			let startTime: number = null;
			const distance = position.y - block.y;
			let lastTimestamp = performance.now();
			const animateStep = (timestamp: DOMHighResTimeStamp) => {
				const timeDiff = timestamp - lastTimestamp;
				const frameTime = duration / timeDiff;
				const step = distance / frameTime;
				lastTimestamp = timestamp;
				if (!startTime) {
					startTime = timestamp;
				}
				if (timestamp - startTime < duration) {
					if (block.y + step >= position.y) {
						block.y = position.y;
					} else {
						block.y += step;
					}
					console.log(block.y > position.y);
					requestAnimationFrame(animateStep);
				} else {
					res();
				}
			};
   
			requestAnimationFrame(animateStep);
		});
	}
 
	public async removeBlock(block: Block, duration = 200) {
		const initialWidth = block.width;
		return new Promise<void>((res) => {
			let start: number = null;
			let lastTimestamp = performance.now(); // current timestamp value
			const animateStep = (timestamp: DOMHighResTimeStamp) => {
				const timeDiff = timestamp - lastTimestamp;
				const frameTime = duration / timeDiff;
				const speed = initialWidth / frameTime;
				lastTimestamp = timestamp;
				if (!start) {
					start = timestamp;
				}
				if (timestamp - start <= duration) {
					block.width -= speed;
					block.height -= speed;
					block.x += speed / 2;
					block.y += speed / 2;
					requestAnimationFrame(animateStep);
				} else {
					res();
				}
			};
   
			requestAnimationFrame(animateStep);
		});
	}
}
