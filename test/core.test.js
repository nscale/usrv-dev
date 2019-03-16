const { expect, fail } = require('code')
const Lab = require('lab')
const { after, before, describe, it } = (exports.lab = Lab.script())

const Nscale = require('../src/nscale')
const service = Nscale({})

async function init() {
  service.on({ a: 1 }, msg => {
    return { ok: true, ...msg }
  })

  await service.use({
    plugin: async function(options) {
      this.add({ c: 1 }, msg => ({ ok: true, ...msg }))
    }
  })
}

init()

describe('core', () => {
  it('resolves to an actor wih a matching pattern', async () => {
    let out
    try {
      out = await service.post({ a: 1 })

      expect(out.ok).to.be.true()
      expect(out.a).to.equal(1)
    } catch (error) {
      console.log(error)
      fail()
    }
  })

  it('is instance safe', async () => {
    const serviceB = Emmu.spawn()
    let out

    try {
      out = await serviceB.send({ a: 1 })
      if (out) fail('should have no pattern found error')
    } catch (error) {
      expect(error).to.exist()
    }
  })

  it('can load actors via plugins', async () => {
    let out

    out = await service.send({ a: 1 })

    expect(out.ok).to.be.true()
    expect(out.a).to.equal(1)

    out = await service.send({ c: 1 })

    expect(out.ok).to.be.true()
    expect(out.c).to.equal(1)
  })
})
