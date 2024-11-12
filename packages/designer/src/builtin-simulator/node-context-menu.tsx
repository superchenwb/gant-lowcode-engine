import { BuiltinSimulatorHost } from './host';
import { Menu, CONTEXT_MENU_ID } from '@alilc/lowcode-utils';

export const NodeContextMenu = ({ host }: { host: BuiltinSimulatorHost }) => {
  return <Menu id={CONTEXT_MENU_ID} />;
};
