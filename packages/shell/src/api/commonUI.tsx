import { IPublicApiCommonUI, IPublicModelPluginContext, IPublicTypeContextMenuAction } from '@alilc/lowcode-types';
import {
  HelpTip,
  IEditor,
  Tip as InnerTip,
  Title as InnerTitle,
 } from '@alilc/lowcode-editor-core';
import { Balloon, Breadcrumb, Button, Card, Checkbox, DatePicker, Dialog, Dropdown, Form, Icon, Input, Loading, Message, Overlay, Pagination, Radio, Search, Select, SplitButton, Step, Switch, Tab, Table, Tree, TreeSelect, Upload, Divider } from '@alifd/next';
import { ContextMenu } from '../components/context-menu';
import { editorSymbol } from '../symbols';
import { ReactElement } from 'react';

export class CommonUI implements IPublicApiCommonUI {
  [editorSymbol]: IEditor;

  Balloon: typeof Balloon = Balloon;
  Breadcrumb: typeof Breadcrumb = Breadcrumb;
  Button: typeof Button = Button;
  Card: typeof Card = Card;
  Checkbox: typeof Checkbox = Checkbox;
  DatePicker: typeof DatePicker = DatePicker;
  Dialog: typeof Dialog = Dialog;
  Dropdown: typeof Dropdown = Dropdown;
  Form: typeof Form = Form;
  Icon: typeof Icon = Icon;
  Input: typeof Input = Input;
  Loading: typeof Loading = Loading;
  Message: typeof Message = Message;
  Overlay: typeof Overlay = Overlay;
  Pagination: typeof Pagination = Pagination;
  Radio: typeof Radio = Radio;
  Search: typeof Search = Search;
  Select: typeof Select = Select;
  SplitButton: typeof SplitButton = SplitButton;
  Step: typeof Step = Step;
  Switch: typeof Switch = Switch;
  Tab: typeof Tab = Tab;
  Table: typeof Table = Table;
  Tree: typeof Tree = Tree;
  TreeSelect: typeof TreeSelect = TreeSelect;
  Upload: typeof Upload = Upload;
  Divider: typeof Divider = Divider;

  ContextMenu: ((props: {
    menus: IPublicTypeContextMenuAction[];
    children: React.ReactElement[] | React.ReactElement;
  }) => ReactElement) & {
    create(menus: IPublicTypeContextMenuAction[], event: MouseEvent | React.MouseEvent): void;
  };

  constructor(editor: IEditor) {
    this[editorSymbol] = editor;

    const innerContextMenu = (props: any) => {
      const pluginContext: IPublicModelPluginContext = editor.get('pluginContext') as IPublicModelPluginContext;
      return <ContextMenu {...props} pluginContext={pluginContext} />;
    };

    innerContextMenu.create = (menus: IPublicTypeContextMenuAction[], event: MouseEvent) => {
      const pluginContext: IPublicModelPluginContext = editor.get('pluginContext') as IPublicModelPluginContext;
      return ContextMenu.create(pluginContext, menus, event);
    };

    this.ContextMenu = innerContextMenu;
  }

  get Tip() {
    return InnerTip;
  }

  get HelpTip() {
    return HelpTip;
  }

  get Title() {
    return InnerTitle;
  }
}
