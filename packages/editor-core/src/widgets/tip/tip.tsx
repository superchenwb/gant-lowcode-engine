import { Component } from 'react';
import { IPublicTypeTipConfig } from '@gant-lowcode/lowcode-types';
import { uniqueId } from '@gant-lowcode/lowcode-utils';
import { postTip } from './tip-handler';

export class Tip extends Component<IPublicTypeTipConfig> {
  private id = uniqueId('tips$');

  componentWillUnmount() {
    postTip(this.id, null);
  }

  render() {
    postTip(this.id, this.props);
    return <meta data-role="tip" data-tip-id={this.id} />;
  }
}
