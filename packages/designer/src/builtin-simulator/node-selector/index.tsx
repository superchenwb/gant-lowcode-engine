import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Title, observer } from '@alilc/lowcode-editor-core';
import { INode } from '@alilc/lowcode-designer';
import { canClickNode } from '@alilc/lowcode-utils';
import './index.less';

const useMouseHover = <T extends { current: HTMLDivElement | null }>(
  ref: T,
  enter?: () => void,
  leave?: () => void,
) => {
  useEffect(() => {
    let timer: number | null = null;
    let unmounted = false;
    const onMouseOver = (e: globalThis.MouseEvent) => {
      const target: HTMLElement = e.target as any;
      timer !== null && clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (unmounted) return;
        if (ref?.current?.contains(target)) {
          enter && enter();
        } else {
          leave && leave();
        }
      }, 100);
    };

    document.addEventListener('mouseover', onMouseOver);
    return () => {
      unmounted = true;
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, []);
};

export interface ISelectorProps {
  node: INode;
  style?: React.CSSProperties;
}

const NodeSelector: React.FC<ISelectorProps> = observer(function ({
  node,
}: ISelectorProps) {
  const [expand, setExpand] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onSelect = (node: INode) => (event: MouseEvent) => {
    if (!node) {
      return;
    }

    const canClick = canClickNode(node.internalToShellNode()!, event);

    if (canClick && typeof node.select === 'function') {
      node.select();
      const editor = node.document?.designer.editor;
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.eventBus.emit('designer.border.action', {
        name: 'select',
        selected,
      });
    }
  };

  const onMouseOver =
    (node: INode) =>
    (_: any, flag = true) => {
      if (node && typeof node.hover === 'function') {
        node.hover(flag);
      }
    };

  const onMouseOut =
    (node: INode) =>
    (_: any, flag = false) => {
      if (node && typeof node.hover === 'function') {
        node.hover(flag);
      }
    };

  const renderMenu = () => {
    const parents = node.getParents();
    return (
      <div className={'instance-node-selector-list'}>
        {parents.slice(0, 4).map((node, key) => {
          return (
            <div
              key={key}
              onClick={onSelect(node)}
              onMouseEnter={onMouseOver(node)}
              onMouseLeave={onMouseOut(node)}
              className="instance-node-selector-node"
            >
              <div className="instance-node-selector-node-content">
                <Title
                  className="instance-node-selector-node-title"
                  title={{
                    label: node.title,
                    icon: node.icon,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useMouseHover(
    ref,
    () => {
      setExpand(true);
    },
    () => {
      setExpand(false);
    },
  );

  return (
    <div ref={ref} className="instance-node-selector">
      <div className="instance-node-selector-current">
        <Title
          className="instance-node-selector-node-title"
          title={{
            label: node.title,
            icon: node.icon,
          }}
        />
      </div>
      {expand && renderMenu()}
    </div>
  );
});

export default NodeSelector;
