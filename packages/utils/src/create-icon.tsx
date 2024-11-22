import { isValidElement, ReactNode, createElement, cloneElement } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { IPublicTypeIconType } from '@gant-lowcode/lowcode-types';
import { isReactComponent } from './is-react';
import { isESModule } from './is-es-module';
import { SizePresets } from './svg-icon';
import { isObject, isString } from 'lodash';

let LowcodeEngineIcon: any;
document.addEventListener('DOMContentLoaded', function () {
  // console.log('3 seconds passed');
  LowcodeEngineIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4742850_ftjdvki4rx.js', // 在 iconfont.cn 上生成
  });
});

const URL_RE = /^(https?:)\/\//i;

export function createIcon(
  icon?: IPublicTypeIconType | null,
  props?: Record<string, any>,
): ReactNode {
  if (!icon) {
    return null;
  }
  if (isESModule(icon)) {
    icon = icon.default;
  }
  let style: React.CSSProperties = { fontSize: 16 };
  if (props?.size) {
    if (props?.size) {
      if (SizePresets.hasOwnProperty(props?.size)) {
        style.fontSize = SizePresets[props?.size];
      } else {
        style.fontSize = props?.size;
      }
    } else if (isObject(icon) && icon?.size) {
      if (SizePresets.hasOwnProperty(icon?.size)) {
        style.fontSize = SizePresets[icon?.size];
      } else {
        style.fontSize = icon?.size;
      }
    }
  }
  if (isObject(props) && isObject(props?.style)) {
    style = { ...props?.style, ...style };
  } else if (isObject(icon) && isObject(icon?.style)) {
    style = { ...icon?.style, ...style };
  }
  if (typeof icon === 'string') {
    if (URL_RE.test(icon)) {
      return createElement('img', {
        src: icon,
        class: props?.className,
        ...props,
      });
    }
    return <LowcodeEngineIcon type={'icon-' + icon} {...props} style={style} />;
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
  return <LowcodeEngineIcon {...icon} type={'icon-' + icon?.type} {...props} style={style} />;
}
