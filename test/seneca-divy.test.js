const { expect, fail } = require('code')
const Lab = require('lab')
const { after, before, describe, it } = (exports.lab = Lab.script())

const Wreck = require('@hapi/wreck')
const Seneca = require('seneca')
const Divy = require('../seneca-divy')

describe('seneca divy', () => {
  it('exposes pin table via PDR', async () => {
    const s = makeInstance()
      .message('a:b', () => ({ ok: true }))
      .use(Divy)

    const seneca = await s.ready()

    console.log('-------seneca done ---------')
    console.log('making the request')

    const res = await Wreck.request('get', 'http://127.0.0.1:40000/pdr')
    const body = await Wreck.read(res)
    const data = JSON.parse(body.toString())

    expect(data).to.equal([{ pin: { a: 'b' }, model: 'consume', type: 'http' }])
  })

  it('fails if you try to call client', async () => {
    const s = makeInstance().use(Divy)

    try {
      s.client(9000)
    } catch (error) {
      expect(error).to.exist()
      return
    }

    fail('should have prevented direct seneca.client call')
  })

  it('fails if you try to call listen', async () => {
    const s = makeInstance().use(Divy)

    try {
      s.listen(9000)
    } catch (error) {
      expect(error).to.exist()
      return
    }

    fail('should have prevented direct seneca.listen call')
  })
})

function makeInstance() {
  return Seneca()
    .test()
    .use('promisify')
}
