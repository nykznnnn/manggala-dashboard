export const generateAngsuran = (tenor = 36) => {
  return Array.from({ length: tenor }, () => ({
    status: "merah",
  }));
};