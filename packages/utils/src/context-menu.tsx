import { CheckOutlined } from '@ant-design/icons';
import {
  IPublicEnumContextMenuType,
  IPublicModelNode,
  IPublicModelPluginContext,
  IPublicTypeContextMenuAction,
  IPublicTypeContextMenuItem,
} from '@gant-lowcode/lowcode-types';
import { Logger } from './logger';
import React from 'react';
import { Item, Separator, Submenu, contextMenu } from './react-contexify';
import './context-menu.css';

export * from './react-contexify';

const logger = new Logger({ level: 'warn', bizName: 'utils' });

const MAX_LEVEL = 2;

interface IOptions {
  nodes?: IPublicModelNode[] | null;
  destroy?: Function;
  pluginContext: IPublicModelPluginContext;
}

const Tree = (props: {
  node?: IPublicModelNode | null;
  children?: React.ReactNode;
  options: IOptions;
}) => {
  const { node } = props;

  if (!node) {
    return <div className="engine-context-menu-tree-wrap">{props.children}</div>;
  }

  const { common } = props.options.pluginContext || {};
  const { intl } = common?.utils || {};
  const indent = node.zLevel * 8 + 32;
  const style = {
    paddingLeft: indent,
    marginLeft: -indent,
    marginRight: -10,
    paddingRight: 10,
  };

  return (
    <Tree {...props} node={node.parent}>
      <div
        className="engine-context-menu-title"
        onClick={() => {
          props.options.destroy?.();
          node.select();
        }}
        style={style}
      >
        {props.options.nodes?.[0].id === node.id ? (
          <CheckOutlined className="engine-context-menu-tree-selecte-icon" />
        ) : null}
        {intl(node.title)}
      </div>
      <div className="engine-context-menu-tree-children">{props.children}</div>
    </Tree>
  );
};

export const CONTEXT_MENU_ID = 'engine-context-menu';

let destroyFn: Function | undefined;

export function parseContextMenuAsReactNode(
  menus: IPublicTypeContextMenuItem[],
  options: IOptions,
): React.ReactNode[] {
  const { common, commonUI } = options.pluginContext || {};
  const { intl = (title: any) => title } = common?.utils || {};
  const { HelpTip } = commonUI || {};

  const children: React.ReactNode[] = [];
  menus.forEach((menu, index) => {
    if (menu.type === IPublicEnumContextMenuType.SEPARATOR) {
      children.push(<Separator key={menu.name || index} />);
      return;
    }

    if (menu.type === IPublicEnumContextMenuType.MENU_ITEM) {
      if (menu.items && menu.items.length) {
        children.push(
          <Submenu disabled={menu.disabled} key={menu.name} label={intl(menu.title || '')}>
            {parseContextMenuAsReactNode(menu.items, options)}
          </Submenu>,
        );
      } else {
        children.push(
          <Item
            disabled={menu.disabled}
            onClick={() => {
              menu.action?.();
            }}
            key={menu.name}
          >
            <div className="engine-context-menu-text">
              {menu.title ? intl(menu.title) : null}
              {menu.help ? <HelpTip size="xs" help={menu.help} direction="right" /> : null}
            </div>
          </Item>,
        );
      }
    }

    if (menu.type === IPublicEnumContextMenuType.NODE_TREE) {
      children.push(<Tree node={options.nodes?.[0]} options={options} />);
    }
  });

  return children;
}

export function parseContextMenuProperties(
  menus: (IPublicTypeContextMenuAction | Omit<IPublicTypeContextMenuAction, 'items'>)[],
  options: IOptions & {
    event?: MouseEvent;
  },
  level = 1,
): IPublicTypeContextMenuItem[] {
  destroyFn?.();

  const { nodes, destroy } = options;
  if (level > MAX_LEVEL) {
    logger.warn('context menu level is too deep, please check your context menu config');
    return [];
  }

  return menus
    .filter((menu) => !menu.condition || (menu.condition && menu.condition(nodes || [])))
    .map((menu) => {
      const { name, title, type = IPublicEnumContextMenuType.MENU_ITEM, help } = menu;

      const result: IPublicTypeContextMenuItem = {
        name,
        title,
        type,
        help,
        action: () => {
          destroy?.();
          menu.action?.(nodes || [], options.event);
        },
        disabled: (menu.disabled && menu.disabled(nodes || [])) || false,
      };

      if ('items' in menu && menu.items) {
        result.items = parseContextMenuProperties(
          typeof menu.items === 'function' ? menu.items(nodes || []) : menu.items,
          options,
          level + 1,
        );
      }

      return result;
    })
    .reduce((menus: IPublicTypeContextMenuItem[], currentMenu: IPublicTypeContextMenuItem) => {
      if (!currentMenu.name) {
        return menus.concat([currentMenu]);
      }

      const index = menus.find((item) => item.name === currentMenu.name);
      if (!index) {
        return menus.concat([currentMenu]);
      } else {
        return menus;
      }
    }, []);
}

let cachedMenuItemHeight: string | undefined;

function getMenuItemHeight() {
  if (cachedMenuItemHeight) {
    return cachedMenuItemHeight;
  }
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const menuItemHeight = styles.getPropertyValue('--context-menu-item-height').trim();
  cachedMenuItemHeight = menuItemHeight;

  return menuItemHeight;
}

export function createContextMenu(
  children: React.ReactNode[],
  {
    event,
    offset = [0, 0],
  }: {
    event: MouseEvent | React.MouseEvent;
    offset?: [number, number];
  },
) {
  event.preventDefault();
  event.stopPropagation();

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const dividerCount = React.Children.count(
    children.filter((child) => React.isValidElement(child) && child.type === Separator),
  );
  const popupItemCount = React.Children.count(
    children.filter(
      (child) => React.isValidElement(child) && (child.type === Submenu || child.type === Item),
    ),
  );
  const menuHeight = popupItemCount * parseInt(getMenuItemHeight(), 10) + dividerCount * 9 + 16;
  const menuWidthLimit = 200;
  let x = event.clientX + offset[0];
  let y = event.clientY + offset[1];
  if (x + menuWidthLimit > viewportWidth) {
    x = x - menuWidthLimit;
  }
  if (y + menuHeight > viewportHeight) {
    y = y - menuHeight;
  }
  contextMenu.show({
    id: CONTEXT_MENU_ID,
    event,
    children,
    position: {
      x,
      y,
    },
  });
  return () => {
    contextMenu.hideAll();
  };
}
