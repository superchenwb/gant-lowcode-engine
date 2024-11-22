import {
  INode,
  ISettingField,
} from '@gant-lowcode/lowcode-designer';
import { IShellModelFactory, IPublicModelNode } from '@gant-lowcode/lowcode-types';
import { IPublicModelSettingField } from '../../../types/src/shell/model/setting-field';
import {
  Node,
  SettingField,
} from '@gant-lowcode/lowcode-shell';
class ShellModelFactory implements IShellModelFactory {
  createNode(node: INode | null | undefined): IPublicModelNode | null {
    return Node.create(node);
  }
  createSettingField(prop: ISettingField): IPublicModelSettingField {
    return SettingField.create(prop);
  }
}
export const shellModelFactory = new ShellModelFactory();