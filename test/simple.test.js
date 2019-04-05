const usrv = require('../usrv')

const srvfile = config => {
  config.transport.mesh = 'none'
  config.transport.listen = 3000
}

const srv = function(opts) {
  const seneca = this

  seneca.message('my:pattern', async msg => {
    // can so some awaiting things here if needed...

    return { ok: true }
  })
}

srv.meta = {}

usrv(srv, srvfile)
