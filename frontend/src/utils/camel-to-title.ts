const camelToTitle = (camelCase: string): string =>
  camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

export default camelToTitle;
