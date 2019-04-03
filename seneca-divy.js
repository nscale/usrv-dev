/**
 * Seneca Divy leverages the existing seneca methods to register a
 * pattern, but it exposes those registered patterns via a
 * Pin Definition Route (PDR). The divy proxy pulls the
 * definitions from the PDR and can then complete its setup.
 *
 * Seneca Divy overrides the current act/post functionality. This
 * is because every message needs to be pushed to the transport
 * layer to be resolve. Even if that means a message will come
 * directly back to the originating service. In this regard, the
 * resulting post is a hybrid client and therefore we block the
 * direct use of seneca.client.
 *
 * TODO:
 * - Need to provide config for the proxy call. Things like http(s), etc.
 * - Think through meta
 * - Error handling needs to be implemented. Just do HTTP/BOOM errors.
 */
const Fastify = require('fastify')
const Wreck = require('@hapi/wreck')
const _ = require('lodash')
const extractPatterns = require('./lib/extract-patterns')
const resolvePinTable = require('./lib/resolve-pin-table')

const PORT = process.env.PORT || 40000
const HOST = process.env.HOST || '127.0.0.1'
const PROXY_HTTP_PORT = process.env.PROXY_HTTP_PORT || 10000
const PROXY_HTTP_HOST = process.env.PROXY_HTTP_HOST || 'localhost'

const pintable = createPintable()

function divy(opts) {
  const seneca = this
  const http = Fastify()
  const tu = seneca.export('transport/utils')

  seneca.depends('promisify')

  pintable.config(opts.listen)

  seneca.message('init:divy', init)

  async function init(msg) {
    http.route({
      method: 'GET',
      url: '/pdr',
      handler: (req, reply) => {
        console.log({ list: pintable.list() })
        reply.send(pintable.list())
      }
    })

    http.route({
      method: 'POST',
      url: '/act',
      handler: listen
    })

    await http.listen(PORT, HOST)

    console.log('listening via fastify')
  }

  async function listen(req) {
    const msg = tu.internalize_msg(seneca, req.body || {})
    const spec = { meta: {} }

    try {
      spec.out = await seneca.post$(msg)
    } catch (err) {
      spec.err
    }

    return tu.externalize_reply(seneca, spec.err, spec.out, spec.meta)
  }
}

function onPreload() {
  const self = this

  // HACK:
  // We need to insure all other things have been added
  // that could add patterns. So we add ready function to
  // ready queue first, which will get called before main
  // seneca.ready().
  self.ready(function() {
    pintable.merge(this)
  })

  self.client = clientFactory
  self.listen = listenFactory

  // Need to expose an internal post as external post will route
  // through divy proxy.
  self.root.post$ = self.root.post

  self.root.post = async function(msg) {
    const url = `http://${PROXY_HTTP_HOST}:${PROXY_HTTP_PORT}`
    const meta = {}
    const payload = tu.externalize_msg(self, msg, meta)

    const res = await Wreck.request('post', url, { payload })
    const body = await Wreck.read(res)
    const data = parseJSON(body)

    return internalize_reply(self, data)
  }

  function listenFactory(msg) {
    throw Error('divy doesnt support calling listen directly')
  }

  function clientFactory(msg) {
    throw Error('divy doesnt support calling client directly')
  }
}

function createPintable() {
  let table = []
  let config = {}

  return {
    merge: instance => {
      table = resolvePinTable(extractPatterns(instance), config)
    },
    config: opts => {
      config = opts
    },
    list: () => {
      return table
    }
  }
}

function parseJSON(data) {
  if (!data) return

  var str = data.toString()

  try {
    return JSON.parse(str)
  } catch (e) {
    e.input = str
    return e
  }
}

module.exports = divy
module.exports.preload = onPreload
