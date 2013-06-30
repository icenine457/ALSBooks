exports.searchTable = function(val) {
  if (!isNaN(+val)) {
    return parseInt(val);
  }
  if (val == "true") {
    return true;
  }
  if (val == "false") {
    return false;
  }
  return new RegExp(val, "gi");
}
