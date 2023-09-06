import Block from '../components/Block';
import {IPosition} from '../interfaces';

export default class AnimationService {
	public async moveBlockToTheBottom(block: Block, position: IPosition, duration = 300) {
		return new Promise<void>((resolve) => {
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
					requestAnimationFrame(animateStep);
				} else {
					block.y = position.y;
					resolve();
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
 
	public async createBlock(block: Block, duration = 300) {
		const finalWidth = block.width;
		const finalHeight = block.height;
		const finalPos: IPosition = {
			x: block.x,
			y: block.y
		};
		block.width = 10;
		block.height = 10;
		block.x = block.x + finalWidth / 2 - 5;
		block.y = block.y + finalHeight / 2 - 5;
		return new Promise<void>((res) => {
			let start: number = null;
			let lastTimestamp = performance.now(); // current timestamp value
			const animateStep = (timestamp: DOMHighResTimeStamp) => {
				const timeDiff = timestamp - lastTimestamp;
				const frameTime = duration / timeDiff;
				const step = finalWidth / frameTime;
				lastTimestamp = timestamp;
				if (!start) {
					start = timestamp;
				}
				const finalStep = () => {
					block.width = finalWidth;
					block.height = finalHeight;
					block.x = finalPos.x;
					block.y = finalPos.y;
				};
				if (timestamp - start < duration) {
					if (
						block.width + step >= finalWidth
            || block.x <= finalPos.x
            || block.y <= finalPos.y
					) {
						finalStep();
					} else {
						block.width += step;
						block.height += step;
						block.x -= step / 2;
						block.y -= step / 2;
					}
					requestAnimationFrame(animateStep);
				} else {
					finalStep();
					res();
				}
			};
   
			requestAnimationFrame(animateStep);
		});
	}
}
