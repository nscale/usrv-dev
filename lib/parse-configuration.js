function parseConfig(srv, srvfile) {
  const {
    name,
    tag,
    version,
    timeout,
    transport,
    listen,
    blocks,
    plugins,
    relativeTo,
    mesh,
    ...unmapped
  } = srvfile

  return {
    container: {
      // Tag this service instance.
      tag: name || tag || srv.name,

      // Standard timeout applied to actions
      timeout: timeout || 15000,

      // Apply legacy flags to seneca
      legacy: {
        error: false,
        transport: false
      }
    },

    // Set service version. Defaults to service package.json
    version: version || srv.meta.version,

    // Provide transport configuration
    transport: Object.assign({}, { mesh: mesh || 'seneca' }, transport, {
      listen
    }),

    // Configuration passed into service at initialization
    srv: srvfile.srv || {},

    // Add plugins to your service
    plugins: ['seneca-promisify'].concat(plugins || []),

    // When adding local blocks, you can override what local blocks are relative to.
    relativeTo: relativeTo
  }
}

function createConfig() {
  return { transport: {}, plugins: [] }
}

module.exports = { parseConfig, createConfig }
