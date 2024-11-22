import React, { Component } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import {
  Title,
  observer,
  Editor,
  obx,
  globalContext,
  engineConfig,
  makeObservable,
} from '@gant-lowcode/lowcode-editor-core';
import { Node, SettingField, isSettingField, INode } from '@gant-lowcode/lowcode-designer';
import classNames from 'classnames';
import { SettingsMain } from './main';
import { SettingsPane } from './settings-pane';
import { StageBox } from '../stage-box';
import { SkeletonContext } from '../../context';
import { intl } from '../../locale';
import { createIcon } from '@gant-lowcode/lowcode-utils';

interface ISettingsPrimaryPaneProps {
  engineEditor: Editor;
  config: any;
}

@observer
export class SettingsPrimaryPane extends Component<
  ISettingsPrimaryPaneProps,
  { shouldIgnoreRoot: boolean }
> {
  state = {
    shouldIgnoreRoot: false,
  };
  private main = new SettingsMain(this.props.engineEditor);

  @obx.ref private _activeKey?: string = undefined;

  static contextType = SkeletonContext;

  // declare context: React.ContextType<typeof SkeletonContext>;

  constructor(props: ISettingsPrimaryPaneProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.setShouldIgnoreRoot();

    const editor = this.props.engineEditor;

    editor.eventBus.on('designer.selection.change', () => {
      if (!engineConfig.get('stayOnTheSameSettingTab', false)) {
        this._activeKey = undefined;
      }
    });
  }

  async setShouldIgnoreRoot() {
    const designMode = await globalContext.get('editor').get('designMode');
    this.setState({
      shouldIgnoreRoot: designMode === 'live',
    });
  }

  componentWillUnmount() {
    this.main.purge();
  }

  renderBreadcrumb() {
    const { settings, editor } = this.main;
    const skeleton = editor?.get('skeleton');
    // const shouldIgnoreRoot = config.props?.ignoreRoot;
    const { shouldIgnoreRoot } = this.state;
    if (!settings) {
      return null;
    }
    if (settings.isMultiple) {
      return (
        <div className="lc-settings-navigator">
          {createIcon(settings.componentMeta?.icon, {
            className: 'lc-settings-navigator-icon',
          })}
          <div style={{ marginLeft: '5px' }}>
            <Title title={settings.componentMeta!.title} />
            <span> x {settings.nodes.length}</span>
          </div>
        </div>
      );
    }

    const designer = editor.get('designer');
    const current = designer?.currentSelection?.getNodes()?.[0];
    let node: INode | null = settings.first;
    const focusNode = node.document?.focusNode;

    const items = [];
    let l = 3;
    while (l-- > 0 && node) {
      const _node = node;
      // dirty code: should remove
      if (shouldIgnoreRoot && node.isRoot()) {
        break;
      }
      if (focusNode && node.contains(focusNode)) {
        l = 0;
      }
      const item =
        l === 2
          ? { title: <Title title={node.title} /> }
          : {
              onMouseOver: hoverNode.bind(null, _node, true),
              onMouseOut: hoverNode.bind(null, _node, false),
              onClick: () => {
                if (!_node) {
                  return;
                }
                selectNode.call(null, _node);
                const getName = (node: any) => {
                  const npm = node?.componentMeta?.npm;
                  return (
                    [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
                    node?.componentMeta?.componentName ||
                    ''
                  );
                };
                const selected = getName(current);
                const target = getName(_node);
                editor?.eventBus.emit('skeleton.settingsPane.Breadcrumb', {
                  selected,
                  target,
                });
              },
              title: <Title title={node.title} />,
            };

      items.unshift(item);
      node = node.parent;
    }

    return (
      <div className="lc-settings-navigator">
        {createIcon(this.main.componentMeta?.icon, {
          className: 'lc-settings-navigator-icon',
          class: 'lc-settings-navigator-icon',
        })}
        <Breadcrumb className="lc-settings-node-breadcrumb" separator=">" items={items} />
      </div>
    );
  }

  onChange = (key: string) => {
    this._activeKey = key;
  };

  onTabClick = (key: string) => {
    const { settings } = this.main;
    const editor = this.props.engineEditor;
    const { items } = settings;
    const field = items.find((item) => item.name === key);
    editor?.eventBus.emit('skeleton.settingsPane.change', {
      name: field.name,
      title: field.title,
    });
  };

  render() {
    const { settings } = this.main;
    const editor = this.props.engineEditor;
    if (!settings) {
      // 未选中节点，提示选中 或者 显示根节点设置
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Please select a node in canvas')}</p>
          </div>
        </div>
      );
    }

    // 当节点被锁定，且未开启锁定后容器可设置属性
    if (settings.isLocked && !engineConfig.get('enableLockedNodeSetting', false)) {
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Current node is locked')}</p>
          </div>
        </div>
      );
    }
    if (Array.isArray(settings.items) && settings.items.length === 0) {
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('No config found for this type of component')}</p>
          </div>
        </div>
      );
    }

    if (!settings.isSameComponent) {
      // TODO: future support 获取设置项交集编辑
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Please select same kind of components')}</p>
          </div>
        </div>
      );
    }

    const { items } = settings;
    if (items.length > 5 || items.some((item) => !isSettingField(item) || !item.isGroup)) {
      return (
        <div className="lc-settings-main">
          {this.renderBreadcrumb()}
          <div className="lc-settings-body">
            <StageBox skeleton={this.context} target={settings} key={settings.id}>
              <SettingsPane target={settings} usePopup={false} />
            </StageBox>
          </div>
        </div>
      );
    }

    const tabs = (items as SettingField[]).map((field) => {
      return {
        key: field.name,
        label: <Title title={field.title} />,
        children: (
          <StageBox skeleton={this.context} target={field} key={field.id}>
            <SettingsPane target={field} key={field.id} usePopup={false} />
          </StageBox>
        ),
      };
    });
    const activeKey = this._activeKey;

    const className = classNames('lc-settings-main', {
      'lc-settings-hide-tabs':
        items.length === 1 && engineConfig.get('hideSettingsTabsWhenOnlyOneItem', false),
    });
    return (
      <div className={className}>
        {this.renderBreadcrumb()}
        <Tabs
          className="lc-settings-tabs"
          defaultActiveKey={items[0]?.name}
          activeKey={activeKey}
          items={tabs}
          indicator={{ align: 'center' }}
          onChange={this.onChange}
          onTabClick={this.onTabClick}
        />
      </div>
    );
  }
}

function hoverNode(node: Node, flag: boolean) {
  node.hover(flag);
}
function selectNode(node: Node) {
  node?.select();
}
