const _ = require('lodash')

module.exports = function configureTransport(instance, config) {
  function configureDivyMesh() {
    throw Error('divy transport not supported yet')
  }

  function configureSenecaMesh() {
    const discover = {}

    instance.use(require('seneca-mesh'), {
      ..._.omit(config, ['provider', 'baseDNS']),
      ...{ discover }
    })
  }

  function configurePointToPoint() {
    if (_.isArray(config.listen)) {
      config.listen.forEach(l => instance.listen(l))
    } else {
      instance.listen(config.listen)
    }
  }

  const bindings = {
    divy: configureDivyMesh,
    seneca: configureSenecaMesh,
    none: configurePointToPoint
  }

  const fail = () => {
    throw Error('Invalid transport config - transport.mesh')
  }

  return (bindings[config.provider] || fail)()
}
