import { IPublicTypeJSFunction } from '../shell/type/value-type';

/**
 * @deprecated use same function from '@gant-lowcode/lowcode-utils' instead
 */
export function isJSFunction(x: any): x is IPublicTypeJSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}
