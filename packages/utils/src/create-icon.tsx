import { isValidElement, ReactNode, createElement, cloneElement } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { IPublicTypeIconType } from '@alilc/lowcode-types';
import { isReactComponent } from './is-react';
import { isESModule } from './is-es-module';

let LowcodeEngineIcon: any;
document.addEventListener('DOMContentLoaded', function () {
  // console.log('3 seconds passed');
  LowcodeEngineIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4742850_ohyylrsdkli.js', // 在 iconfont.cn 上生成
  });
});

const URL_RE = /^(https?:)\/\//i;

export function createIcon(
  icon?: IPublicTypeIconType | null,
  props?: Record<string, unknown>,
): ReactNode {
  if (!icon) {
    return null;
  }
  if (isESModule(icon)) {
    icon = icon.default;
  }
  if (typeof icon === 'string') {
    if (URL_RE.test(icon)) {
      return createElement('img', {
        src: icon,
        class: props?.className,
        ...props,
      });
    }
    return <LowcodeEngineIcon type={'icon-' + icon} {...props} style={{ fontSize: '20px' }} />;
  }
  if (isValidElement(icon)) {
    return cloneElement(icon, { ...props });
  }
  if (isReactComponent(icon)) {
    return createElement(icon, {
      class: props?.className,
      ...props,
    });
  }

  return <LowcodeEngineIcon {...icon} {...props} />;
}
