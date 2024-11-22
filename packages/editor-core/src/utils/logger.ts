import { Logger, Level } from '@gant-lowcode/lowcode-utils';

export { Logger };

export function getLogger(config: { level: Level; bizName: string }): Logger {
  return new Logger(config);
}
