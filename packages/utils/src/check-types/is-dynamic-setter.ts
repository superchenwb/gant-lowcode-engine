import { isFunction } from '../is-function';
import { isReactClass } from '../is-react';
import { IPublicTypeDynamicSetter } from '@gant-lowcode/lowcode-types';

export function isDynamicSetter(obj: any): obj is IPublicTypeDynamicSetter {
  if (!isFunction(obj)) {
    return false;
  }
  return !isReactClass(obj);
}
