const Path = require('path')
const _ = require('lodash')

const requireRelativeTo = (path, relativeTo) => {
  if (relativeTo && path[0] === '.') {
    path = Path.join(relativeTo, path)
  }

  return require(path)
}

const parseBlock = relativeTo => block => {
  const blockObject = { block, options: {} }

  if (_.isString(block)) {
    blockObject.block = requireRelativeTo(block, relativeTo)
  }

  if (_.isObject(block)) {
    block.block = block.block || block.plugin

    if (_.isString(block.block)) {
      blockObject.options = block.options || blockObject.options
      blockObject.block = requireRelativeTo(block.block, relativeTo)
    }
  }

  return blockObject
}

module.exports = function loadBlocks(instance, blocks = [], relativeTo) {
  const blockObjects = blocks.map(parseBlock(relativeTo || process.cwd()))

  blockObjects.forEach(bo => {
    instance.use(bo.block, bo.options)
  })
}
