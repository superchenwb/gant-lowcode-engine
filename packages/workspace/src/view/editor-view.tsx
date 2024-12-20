import { BuiltinLoading } from '@gant-lowcode/lowcode-designer';
import { engineConfig, observer } from '@gant-lowcode/lowcode-editor-core';
import {
  Workbench,
} from '@gant-lowcode/lowcode-editor-skeleton';
import { PureComponent } from 'react';
import { Context } from '../context/view-context';

export * from '../context/base-context';

@observer
export class EditorView extends PureComponent<{
  editorView: Context;
  active: boolean;
}, any> {
  render() {
    const { active } = this.props;
    const editorView = this.props.editorView;
    const skeleton = editorView.innerSkeleton;
    if (!editorView.isInit) {
      const Loading = engineConfig.get('loadingComponent', BuiltinLoading);
      return <Loading />;
    }

    return (
      <Workbench
        skeleton={skeleton}
        className={active ? 'active engine-editor-view' : 'engine-editor-view'}
        topAreaItemClassName="engine-actionitem"
      />
    );
  }
}
