import { IPublicTypeActionContentObject } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isActionContentObject(obj: any): obj is IPublicTypeActionContentObject {
  return isObject(obj);
}
