declare global {
  interface Array<T> {
    remove(value: T): number;
  }
}

Array.prototype.remove = function remove(value: any) {
  const idx = this.indexOf(value);
  if (idx >= 0) this.splice(idx, 1);
  return idx;
};
