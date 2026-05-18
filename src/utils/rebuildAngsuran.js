export function rebuildAngsuranSimple(tenor) {
  return Array.from({ length: Number(tenor) || 0 }, () => ({
    status: null,
    updatedAt: null,
  }));
}