import { IPublicTypeDOMText } from '../shell/type/dom-text';

/**
 * @deprecated use same function from '@gant-lowcode/lowcode-utils' instead
 */
export function isDOMText(data: any): data is IPublicTypeDOMText {
  return typeof data === 'string';
}
