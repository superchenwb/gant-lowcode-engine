import { IPublicTypeLocationChildrenDetail, IPublicTypeLocationDetailType } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isLocationChildrenDetail(obj: any): obj is IPublicTypeLocationChildrenDetail {
  if (!isObject(obj)) {
    return false;
  }
  return obj.type === IPublicTypeLocationDetailType.Children;
}