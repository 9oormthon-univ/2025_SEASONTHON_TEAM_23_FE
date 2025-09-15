export const toggleInArray = <T>(list: T[], value: T) => {
  const i = list.findIndex((v) => Object.is(v, value));
  if (i === -1) return [...list, value];
  const next = list.slice();
  next.splice(i, 1);
  return next;
};
