exports.searchTable = function(val) {
  if (!isNaN(+val)) {
    return parseInt(val);
  }
  return new RegExp(val, "gi");
}
