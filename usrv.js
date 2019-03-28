const Seneca = require('seneca')
const _ = require('lodash')
const extractPatterns = require('./lib/extractPatterns')

const configTemplate = { transport: {}, blocks: [] }

function createConf(srv, overrides) {
  const mapped = ['name', 'version', 'timeout', 'transport', 'srv', 'blocks']
  const unmapped = _.exclude(mapped, overrides)

  return {
    // Tag the service
    tag: overrides.name || srv.name,
    // Set version
    version: overrides.version || srv.meta.version,
    // Set a network timeout for requests
    timeout: overrides.timeout || 15000,
    // Apply legacy flags to seneca
    legacy: {
      error: false,
      transport: false
    },
    // Firgure out how to automate this and provide it configure less
    // with overrides.
    transport: overrides.transport,
    // Provides a safe place to store service-specific run-time data
    // without potential conflicts with usrv internals
    srv: overrides.srv || {},

    blocks: [].concat(overrides.blocks || overrides.plugins || []),

    ...unmapped
  }
}

function createUsrv(srv, srvfile) {
  const overrides = srvfile(configTemplate)
  const srvConf = createConf(srv, overrides)
  const instance = Seneca(srvConf)

  instance.use(require('seneca-promisify'))

  loadBlocks(srvConf.blocks)

  instance.use(srv, srvConf.srv)

  instance.ready(function() {
    const patternList = extractPatterns(instance)
    const transportConf = resolveTransportConf(patternList)

    const transportSpec = {
      listen: [{ pins: patterns, model: 'consume', type: 'http' }]
    }

    instance.use(require('seneca-mesh'), transportConf)
  })
}

module.exports = createUsrv
