const Events = require('eventemitter3')
const Assert = require('assert')
const Util = require('util')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const nid = require('nid')

const mixer = require('./mixer')
const router = require('./router')
const plugins = require('./plugins')

// TODO: testing only, add native logging implementation
const localLogger = { info: console.log }

module.exports = function Nscale(options = {}) {
  const attrs = {
    info: {
      instanceId: uuidv4(),
      tag: options.tag || nid()
    },
    options: options
  }

  const props = {
    log: options.logger || localLogger
  }

  const _root = Object.assign({}, props, Events.prototype)
  _root.options = () => attrs.options
  _root.info = key => (key ? attrs.info[key] : attrs.info)

  const mixin = mixer(_root)

  mixin(router)
  mixin(plugins)

  return _root
}
