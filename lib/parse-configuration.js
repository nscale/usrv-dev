function parseConfig(srv, overrides) {
  const {
    name,
    tag,
    version,
    timeout,
    transport,
    srv,
    blocks,
    plugins,
    relativeTo,
    mesh,
    ...unmapped
  } = overrides

  return {
    // Tag this service instance.
    tag: name || tag || srv.name,

    // Set service version. Defaults to service package.json
    version: version || srv.meta.version,

    // Standard timeout applied to actions
    timeout: timeout || 15000,

    // Apply legacy flags to seneca
    legacy: {
      error: false,
      transport: false
    },

    // Provide transport configuration
    transport: Object.assign({}, { mesh: mesh || 'divy' }, transport),

    // Configuration passed into service at initialization
    srv: srv || {},

    // Add blocks to your service
    blocks: ['seneca-promisify'].concat(blocks || plugins || []),

    // When adding local blocks, you can override what local blocks are relative to.
    relativeTo: relativeTo,

    // Pass through any config not mapped to allow passing seneca config through.
    ...unmapped
  }
}

function createConfig() {
  return { transport: {}, blocks: [] }
}

module.exports = { parseConfig, createConfig }
