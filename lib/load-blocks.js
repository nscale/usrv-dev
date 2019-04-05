const Path = require('path')

const requireRelativeTo = (path, relativeTo) => {
  if (relativeTo && path[0] === '.') {
    path = Path.join(relativeTo, path)
  }

  return require(path)
}

const parseBlock = relativeTo => block => {
  const blockObject = { block, options: {} }

  if (typeof block === 'string') {
    blockObject.block = requireRelativeTo(block, relativeTo)
  }

  if (typeof block.block === 'string') {
    blockObject.options = block.options || blockObject.options
    blockObject.block = requireRelativeTo(block.block, relativeTo)
  }

  return blockObject
}

module.exports = function loadBlocks(instance, blocks = [], relativeTo) {
  const blockObjects = blocks.map(parseBlock(relativeTo || process.cwd()))

  blockObjects.forEach(bo => {
    instance.use(bo.block, bo.options)
  })
}
