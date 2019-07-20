const Seneca = require('seneca')
const _ = require('lodash')
const registerPlugins = require('./lib/register-plugins')
const configurationUtils = require('./lib/parse-configuration')
const envs = require('./lib/envs')

const { compileConfiguration, compileOptions } = configurationUtils

async function Usrv(srv, srvfile, pkg) {
  if (!srv) {
    throw Error('no service found')
  }

  const srvOptions = compileOptions(srvfile)
  const configuration = compileConfiguration(srv, srvOptions, pkg)

  const container = Seneca(configuration.runtime)

  container.use(require('seneca-promisify'))

  registerPlugins(container, configuration.plugins, configuration.relativeTo)

  container.use(srv, configuration.srv)

  container.use(require('seneca-mesh'), {
    isbase: false,
    bases: ['127.0.0.1'],
    tag: envs.PROJECT_ID,
    listen: configuration.listen,
    balance_client: { debug: { client_updates: false } },
    jointime: envs.SWIM_JOIN_TIMEOUT,
    sneeze: {
      silent: false,
      swim: {
        interval: envs.SWIM_INTERVAL,
        joinTimeout: envs.SWIM_JOIN_TIMEOUT,
        pingTimeout: envs.SWIM_PING_TIMEOUT,
        pingReqTimeout: envs.SWIM_PING_REQUEST_TIMEOUT
      }
    }
  })

  await container.ready()

  container.fixedargs.fatal$ = false
  container.log.info('service is ready')
}

module.exports = Usrv
