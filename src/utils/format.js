export const formatRupiah = (val) => {
  if (!val || val === 0) return "-";
  return `Rp ${Number(val).toLocaleString("id-ID")}`;
};

export const formatNumber = (val) => {
  if (!val) return 0;
  return Number(val);
};