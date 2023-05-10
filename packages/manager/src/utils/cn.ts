export const cn = (...classNames: (string | boolean | undefined)[]) => {
  return classNames.filter(Boolean).join(" ");
};
