import { IPublicModelNode } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isNode<Node = IPublicModelNode>(node: any): node is Node {
  if (!isObject(node)) {
    return false;
  }
  return node.isNode;
}