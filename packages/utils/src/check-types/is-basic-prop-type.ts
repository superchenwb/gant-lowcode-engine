import { IPublicTypeBasicType, IPublicTypePropType } from '@gant-lowcode/lowcode-types';

export function isBasicPropType(propType: IPublicTypePropType): propType is IPublicTypeBasicType {
  if (!propType) {
    return false;
  }
  return typeof propType === 'string';
}