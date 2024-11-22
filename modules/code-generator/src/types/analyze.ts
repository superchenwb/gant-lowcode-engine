import type { IPublicTypeContainerSchema } from '@gant-lowcode/lowcode-types';

export interface ICompAnalyzeResult {
  isUsingRef: boolean;
}

export type TComponentAnalyzer = (container: IPublicTypeContainerSchema) => ICompAnalyzeResult;
