import { ResultFile } from '@gant-lowcode/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.eslintrc',
    'js',
    `
const { eslint } = require('@ice/spec');

module.exports = eslint;
    `,
  );

  return [[], file];
}
