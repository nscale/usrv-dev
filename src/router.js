const Patrun = require('patrun')

module.exports = function router() {
  const attrs = {
    router: Patrun({gex:true})
  }

  return Object.assign(this, {
    setRouter: function setRouter(customRouter) {
      attrs.router = customRouter
    },

    add: function add(pattern, action) {
      return attrs.router.add(pattern, action)
    },

    send: async function send(msg) {
      const action = attrs.router.find(msg)

      if (!action) throw new Error('no actor found')
      
      return action.call(this, msg)
    }
  })
}
