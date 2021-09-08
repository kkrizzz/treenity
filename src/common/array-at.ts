if (!Array.prototype.at) {
  Array.prototype.at = function at(index: number) {
    return index < 0 ? this[this.length + index] : this[index];
  };
}
