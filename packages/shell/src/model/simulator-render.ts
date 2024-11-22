import { IPublicModelSimulatorRender } from '@gant-lowcode/lowcode-types';
import { simulatorRenderSymbol } from '../symbols';
import { BuiltinSimulatorRenderer } from '@gant-lowcode/lowcode-designer';

export class SimulatorRender implements IPublicModelSimulatorRender {
  private readonly [simulatorRenderSymbol]: BuiltinSimulatorRenderer;

  constructor(simulatorRender: BuiltinSimulatorRenderer) {
    this[simulatorRenderSymbol] = simulatorRender;
  }

  static create(simulatorRender: BuiltinSimulatorRenderer): IPublicModelSimulatorRender {
    return new SimulatorRender(simulatorRender);
  }

  get components() {
    return this[simulatorRenderSymbol].components;
  }

  rerender() {
    return this[simulatorRenderSymbol].rerender();
  }
}