import { ResultFile } from '@gant-lowcode/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.browserslistrc',
    '',
    `defaults
ios_saf 9
    `,
  );

  return [[], file];
}
