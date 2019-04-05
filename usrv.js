const Seneca = require('seneca')
const _ = require('lodash')
const loadBlocks = require('./lib/load-blocks')
const { parseConfig, createConfig } = require('./lib/parse-configuration')

function Usrv(srv, srvfile) {
  if (!srv) {
    throw Error('no service found')
  }
  const config = parseConfig(srv, srvfile(createConfig()))
  const instance = Seneca(config)

  loadBlocks(instance, config.blocks, config.relativeTo)

  instance.use(srv, config.srv)

  configureTransport(instance, config.transport)

  instance.ready(function() {
    if (srv.ready && typeof srv.ready === 'function') srv.ready()
  })
}

module.exports = Usrv
