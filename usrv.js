const Seneca = require('seneca')
const extractPatterns = require('./lib/extractPatterns')

const configTemplate = { transport: {} }

function createConf(srv, overrides) {
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
    srv: overrides.srv || {}
  }
}

function createUsrv(srv, srvfile) {
  const overrides = srvfile(configTemplate)
  const srvConf = createConf(srv, overrides)

  const instance = Seneca(srvConf)
    // Promisify's seneca by adding message and post api's
    .use(require('seneca-promisify'))
    // Actually call the service
    .use(srv, srvConf.srv)

  instance.ready(function() {
    const patterns = extractPatterns(instance)

    // Can only use one kind of transport with this.
    // Need to think through how to expose this.
    const transportSpec = {
      listen: [{ pins: patterns, model: 'consume', type: 'http' }]
    }

    // Leverage the mesh plugin
    instance.use(require('@nscale/divy'), transportSpec)
  })
}

module.exports = createUsrv
