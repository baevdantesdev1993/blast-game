import blue from '/src/assets/blocks/blue.png';
import red from '/src/assets/blocks/red.png';
import yellow from '/src/assets/blocks/yellow.png';
import purple from '/src/assets/blocks/purple.png';
import green from '/src/assets/blocks/green.png';

export type BlockColor = 'blue' | 'red' | 'yellow' | 'purple' | 'green'

export type BlockMapType = Record<BlockColor, string>

const blocksMap: BlockMapType = {
	blue,
	red,
	yellow,
	purple,
	green,
};

export const blockColors: Array<BlockColor> = ['blue', 'red', 'purple', 'green', 'yellow'];

export default blocksMap;
