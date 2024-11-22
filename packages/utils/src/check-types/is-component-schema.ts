import { IPublicTypeComponentSchema } from "@gant-lowcode/lowcode-types";

export function isComponentSchema(schema: any): schema is IPublicTypeComponentSchema {
  if (typeof schema === 'object') {
    return schema.componentName === 'Component';
  }
  return false
}
