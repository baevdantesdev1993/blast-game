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
				const speed = distance / frameTime;
				lastTimestamp = timestamp;
				if (!startTime) {
					startTime = timestamp;
				}
				if (timestamp - startTime < duration) {
					block.y += speed;
					requestAnimationFrame(animateStep);
				} else {
					res();
				}
			};
   
			requestAnimationFrame(animateStep);
		});
	}
 
	public async createBlock(block: Block, duration = 300) {
		const finalWidth = block.width;
		block.x = block.x - finalWidth / 2;
		block.y = block.y - finalWidth / 2;
		block.width = 0;
		block.height = 0;
		return new Promise<void>((res) => {
			let start: number = null;
			let lastTimestamp = performance.now(); // current timestamp value
			const animateStep = (timestamp: DOMHighResTimeStamp) => {
				const timeDiff = timestamp - lastTimestamp;
				const frameTime = duration / timeDiff;
				const speed = finalWidth / frameTime;
				lastTimestamp = timestamp;
				if (!start) {
					start = timestamp;
				}
				if (timestamp - start <= duration) {
					block.width += speed;
					block.height += speed;
					block.x -= speed / 2;
					block.y -= speed / 2;
					requestAnimationFrame(animateStep);
				} else {
					res();
				}
			};
   
			requestAnimationFrame(animateStep);
		});
	}
 
	public async removeBlock(block: Block, duration = 300) {
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
