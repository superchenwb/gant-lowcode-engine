import { PureComponent, Component } from 'react';
import classNames from 'classnames';
import TreeNode from '../controllers/tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { IconEyeClose } from '../icons/eye-close';
import { IPublicModelModalNodesManager, IPublicTypeDisposable } from '@gant-lowcode/lowcode-types';
import { IOutlinePanelPluginContext } from '../controllers/tree-master';
import { observer } from '@gant-lowcode/lowcode-editor-core';

class ModalTreeNodeView extends PureComponent<{
  treeNode: TreeNode;
}, {
  treeChildren: TreeNode[] | null;
}> {
  private modalNodesManager: IPublicModelModalNodesManager | undefined | null;
  readonly pluginContext: IOutlinePanelPluginContext;

  constructor(props: {
    treeNode: TreeNode;
  }) {
    super(props);

    // 模态管理对象
    this.pluginContext = props.treeNode.pluginContext;
    const { project } = this.pluginContext;
    this.modalNodesManager = project.currentDocument?.modalNodesManager;
    this.state = {
      treeChildren: this.rootTreeNode.children,
    };
  }

  hideAllNodes() {
    this.modalNodesManager?.hideModalNodes();
  }

  componentDidMount(): void {
    const { rootTreeNode } = this;
    rootTreeNode.onExpandableChanged(() => {
      this.setState({
        treeChildren: rootTreeNode.children,
      });
    });
  }

  get rootTreeNode() {
    const { treeNode } = this.props;
    // 当指定了新的根节点时，要从原始的根节点去获取模态节点
    const { project } = this.pluginContext;
    const rootNode = project.currentDocument?.root;
    const rootTreeNode = treeNode.tree.getTreeNode(rootNode!);

    return rootTreeNode;
  }

  render() {
    const { rootTreeNode } = this;
    const { expanded } = rootTreeNode;

    const hasVisibleModalNode = !!this.modalNodesManager?.getVisibleModalNode();
    return (
      <div className="tree-node-modal">
        <div className="tree-node-modal-title">
          <span>{this.pluginContext.intlNode('Modal View')}</span>
          <div
            className="tree-node-modal-title-visible-icon"
            onClick={this.hideAllNodes.bind(this)}
          >
            {hasVisibleModalNode ? <IconEyeClose /> : null}
          </div>
        </div>
        <div className="tree-pane-modal-content">
          <TreeBranches
            treeNode={rootTreeNode}
            treeChildren={this.state.treeChildren}
            expanded={expanded}
            isModal
          />
        </div>
      </div>
    );
  }
}

@observer
export default class TreeNodeView extends PureComponent<{
  treeNode: TreeNode;
  isModal?: boolean;
  isRootNode?: boolean;
}> {
  state: {
    expanded: boolean;
    selected: boolean;
    hidden: boolean;
    detecting: boolean;
    isRoot: boolean;
    highlight: boolean;
    dropping: boolean;
    conditionFlow: boolean;
    expandable: boolean;
    treeChildren: TreeNode[] | null;
    filterWorking: boolean;
    matchChild: boolean;
    matchSelf: boolean;
  } = {
    expanded: false,
    selected: false,
    hidden: false,
    detecting: false,
    isRoot: false,
    highlight: false,
    dropping: false,
    conditionFlow: false,
    expandable: false,
    treeChildren: [],
    filterWorking: false,
    matchChild: false,
    matchSelf: false,
  };

  eventOffCallbacks: Array<IPublicTypeDisposable | undefined> = [];
  constructor(props: any) {
    super(props);

    const { treeNode, isRootNode } = this.props;
    this.state = {
      expanded: isRootNode ? true : treeNode.expanded,
      selected: treeNode.selected,
      hidden: treeNode.hidden,
      detecting: treeNode.detecting,
      isRoot: treeNode.isRoot(),
      // 是否投放响应
      dropping: treeNode.dropDetail?.index != null,
      conditionFlow: treeNode.node.conditionGroup != null,
      highlight: treeNode.isFocusingNode(),
      expandable: treeNode.expandable,
      treeChildren: treeNode.children,
    };
  }

  componentDidMount() {
    const { treeNode } = this.props;
    const { project } = treeNode.pluginContext;

    const doc = project.currentDocument;

    treeNode.onExpandedChanged(((expanded: boolean) => {
      this.setState({ expanded });
    }));
    treeNode.onHiddenChanged((hidden: boolean) => {
      this.setState({ hidden });
    });

    treeNode.onExpandableChanged((expandable: boolean) => {
      this.setState({
        expandable,
        treeChildren: treeNode.children,
      });
    });
    treeNode.onFilterResultChanged(() => {
      const { filterWorking: newFilterWorking, matchChild: newMatchChild, matchSelf: newMatchSelf } = treeNode.filterReult;
      this.setState({ filterWorking: newFilterWorking, matchChild: newMatchChild, matchSelf: newMatchSelf });
    });
    this.eventOffCallbacks.push(
      doc?.onDropLocationChanged(() => {
        this.setState({
          dropping: treeNode.dropDetail?.index != null,
        });
      }),
    );

    const offSelectionChange = doc?.selection?.onSelectionChange(() => {
      this.setState({ selected: treeNode.selected });
    });
    this.eventOffCallbacks.push(offSelectionChange!);
    const offDetectingChange = doc?.detecting?.onDetectingChange(() => {
      this.setState({ detecting: treeNode.detecting });
    });
    this.eventOffCallbacks.push(offDetectingChange!);
  }

  componentWillUnmount(): void {
    this.eventOffCallbacks?.forEach((offFun: IPublicTypeDisposable | undefined) => {
      offFun && offFun();
    });
  }

  shouldShowModalTreeNode(): boolean {
    const { treeNode, isRootNode } = this.props;
    if (!isRootNode) {
      // 只在 当前树 的根节点展示模态节点
      return false;
    }

    // 当指定了新的根节点时，要从原始的根节点去获取模态节点
    const { project } = treeNode.pluginContext;
    const rootNode = project.currentDocument?.root;
    const rootTreeNode = treeNode.tree.getTreeNode(rootNode!);
    const modalNodes = rootTreeNode.children?.filter((item) => {
      return item.node.componentMeta?.isModal;
    });
    return !!(modalNodes && modalNodes.length > 0);
  }

  render() {
    const { treeNode, isModal, isRootNode } = this.props;
    const className = classNames('tree-node', {
      // 是否展开
      expanded: this.state.expanded,
      // 是否选中的
      selected: this.state.selected,
      // 是否隐藏的
      hidden: this.state.hidden,
      // 是否锁定的
      locked: treeNode.locked,
      // 是否锁定的
      anchored: treeNode.anchored,
      // 是否悬停中
      detecting: this.state.detecting,
      // 是否投放响应
      dropping: this.state.dropping,
      'is-root': this.state.isRoot,
      'condition-flow': this.state.conditionFlow,
      highlight: this.state.highlight,
    });
    let shouldShowModalTreeNode: boolean = this.shouldShowModalTreeNode();

    // filter 处理
    const { filterWorking, matchChild, matchSelf } = this.state;
    if (!isRootNode && filterWorking && !matchChild && !matchSelf) {
      // 条件过滤生效时，如果未命中本节点或子节点，则不展示该节点
      // 根节点始终展示
      return null;
    }
    return (
      <div
        className={className}
        data-id={treeNode.nodeId}
      >
        <TreeTitle
          treeNode={treeNode}
          isModal={isModal}
          expanded={this.state.expanded}
          hidden={this.state.hidden}
          locked={treeNode.locked}
          anchored={treeNode.anchored}
          expandable={this.state.expandable}
        />
        {shouldShowModalTreeNode &&
          <ModalTreeNodeView
            treeNode={treeNode}
          />
        }
        <TreeBranches
          treeNode={treeNode}
          isModal={false}
          expanded={this.state.expanded}
          treeChildren={this.state.treeChildren}
        />
      </div>
    );
  }
}
