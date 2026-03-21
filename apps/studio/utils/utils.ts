export const combineTemplates =
  <T = unknown, C = unknown>(...fns: ((templates: T[], context?: C) => T[])[]) =>
  (templates: T[], context?: C): T[] =>
    fns.reduce((acc, fn) => fn(acc, context), templates);

export const capitalize = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
