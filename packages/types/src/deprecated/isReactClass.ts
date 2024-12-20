import { ComponentClass, Component } from 'react';

/**
 * @deprecated use same function from '@gant-lowcode/lowcode-utils' instead
 */
export function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}
