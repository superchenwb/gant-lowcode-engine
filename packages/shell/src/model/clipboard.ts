import { IPublicModelClipboard } from '@gant-lowcode/lowcode-types';
import { clipboardSymbol } from '../symbols';
import { IClipboard, clipboard } from '@gant-lowcode/lowcode-designer';

export class Clipboard implements IPublicModelClipboard {
  private readonly [clipboardSymbol]: IClipboard;

  constructor() {
    this[clipboardSymbol] = clipboard;
  }

  setData(data: any): void {
    this[clipboardSymbol].setData(data);
  }

  waitPasteData(
      keyboardEvent: KeyboardEvent,
      cb: (data: any, clipboardEvent: ClipboardEvent) => void,
    ): void {
    this[clipboardSymbol].waitPasteData(keyboardEvent, cb);
  }
}