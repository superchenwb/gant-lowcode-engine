/* eslint-disable max-len */
/* Note: this file is generated by "npm run template", please dont modify this file directly */
/* -- instead, you should modify "static-files/rax/.stylelintignore.template" and run "npm run template" */
import { ResultFile } from '@gant-lowcode/lowcode-types';

export default function getFile(): [string[], ResultFile] {
  return [
    ['.'],
    {
      name: '.stylelintignore',
      ext: '',
      content: 'node_modules/\nlib/\ndist/\nbuild/\ncoverage/\ndemo/\nes/\n.rax/\n',
    },
  ];
}
