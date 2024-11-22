import { ResultFile } from '@gant-lowcode/lowcode-types';

export default function getFile(): [string[], ResultFile] {
  return [
    [],
    {
      name: 'abc',
      ext: 'json',
      content: `
{
  "type": "ice-app",
  "builder": "@ali/builder-ice-app"
}
    `,
    },
  ];
}
