export const cn = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(" ");
