import { IPublicTypeActionContentObject } from '../shell';

/**
 * @deprecated use same function from '@gant-lowcode/lowcode-utils' instead
 */
export function isActionContentObject(obj: any): obj is IPublicTypeActionContentObject {
  return obj && typeof obj === 'object';
}
