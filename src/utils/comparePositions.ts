import {IPosition} from '../interfaces';

export default (source: IPosition, target: IPosition): boolean => {
	return source.x === target.x && source.y === target.y;
};
