export const toNumber = (val) => {
  if (val === "" || val === undefined || val === null) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

export const displayNumber = (val) => {
  return val === null || val === undefined
    ? "-"
    : Number(val).toLocaleString();
};