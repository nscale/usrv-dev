module.exports = function configureTransport(instance, config) {
  const map = {
    divy: () => {
      instance.use(require('seneca-divy'), config)
    },
    seneca: () => {
      instance.use(require('seneca-mesh'), config)
    },
    none: () => {
      if (_.isArray(config.listen)) {
        config.listen.forEach(l => instance.listen(l))
      } else {
        instance.listen(config.listen)
      }
    }
  }

  const fail = () => {
    throw Error('Invalid transport config - transport.mesh')
  }

  return (map[config.mesh] || fail)()
}
