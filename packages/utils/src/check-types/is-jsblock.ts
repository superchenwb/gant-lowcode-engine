import { IPublicTypeJSBlock } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isJSBlock(data: any): data is IPublicTypeJSBlock {
  if (!isObject(data)) {
    return false;
  }
  return data.type === 'JSBlock';
}
