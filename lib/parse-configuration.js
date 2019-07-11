const {
  PROJECT_ID,
  SRV_NAME,

  // Transport
  TIMEOUT = 15000,
  HISTORY_ACTIVE = false,
  HISTORY_PRUNE_INTERVAL = 100,
  SNEEZE_SILENT = false,
  SWIM_INTERVAL = 500,
  SWIM_JOIN_TIMEOUT = 2777,
  SWIM_PING_TIMEOUT = 2444,
  SWIM_PING_REQUEST_TIMEOUT = 2333,

  // Mesh
  MESH_JOIN_TIME = 2000,

  // logging
  ENABLE_PRETTY_PRINT = false,
  LOG_LEVEL = 'info'
} = process.env

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
    mesh: Object.assign(
      {
        provider: mesh || 'seneca',
        base: false,
        jointime: MESH_JOIN_TIME,
        sneeze: {
          tag: PROJECT_ID,
          swim: {
            interval: SWIM_INTERVAL,
            joinTimeout: SWIM_JOIN_TIMEOUT,
            pingTimeout: SWIM_PING_TIMEOUT,
            pingReqTimeout: SWIM_PING_REQUEST_TIMEOUT
          }
        }
      },
      { listen }
    ),

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
