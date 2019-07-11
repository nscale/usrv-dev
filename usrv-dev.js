const Seneca = require('seneca')
const _ = require('lodash')
const registerPlugins = require('./lib/register-plugins')
const { parseConfig, createConfig } = require('./lib/parse-configuration')
const configureTransport = require('./lib/configure-transport')

function Usrv(srv, srvfile) {
  if (!srv) {
    throw Error('no service found')
  }

  const srvConfiguration = createConfig()

  srvfile(srvConfiguration)

  srv.meta = srv.meta || {}

  const config = parseConfig(srv, srvConfiguration)
  const instance = Seneca(config.container)

  registerPlugins(instance, config.plugins, config.relativeTo)

  instance.use(srv, config.srv)

  configureTransport(instance, config.mesh)

  return instance
}

module.exports = Usrv
