import { ComponentType } from 'react';
import { isReactClass } from './isReactClass';

/**
 * @deprecated use same function from '@gant-lowcode/lowcode-utils' instead
 */
export function isReactComponent(obj: any): obj is ComponentType<any> {
  return obj && (isReactClass(obj) || typeof obj === 'function');
}
