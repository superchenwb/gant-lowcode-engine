import { IPublicTypeComponentMap, IPublicTypeProCodeComponent } from '@gant-lowcode/lowcode-types';
import { isObject } from '../is-object';

export function isProCodeComponentType(desc: IPublicTypeComponentMap): desc is IPublicTypeProCodeComponent {
  if (!isObject(desc)) {
    return false;
  }

  return 'package' in desc;
}
