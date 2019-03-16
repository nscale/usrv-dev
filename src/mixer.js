
module.exports = function mixer(root) {
  return function (func) {
    return func.call(root)
  }
}