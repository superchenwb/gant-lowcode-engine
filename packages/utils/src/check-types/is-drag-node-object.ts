import { IPublicEnumDragObjectType, IPublicModelNode, IPublicTypeDragNodeObject } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isDragNodeObject<Node = IPublicModelNode>(obj: any): obj is IPublicTypeDragNodeObject<Node> {
  if (!isObject(obj)) {
    return false;
  }
  return obj.type === IPublicEnumDragObjectType.Node;
}