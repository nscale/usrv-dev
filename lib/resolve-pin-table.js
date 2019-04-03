const _ = require('lodash')

const applyDefaultDefinitions = pins => {
  return pins.map(pin => ({ pin, model: 'consume', type: 'http' }))
}

module.exports = (registeredPatternList, overrides = []) => {
  const defaults = applyDefaultDefinitions(registeredPatternList)
  const custom = []

  overrides.forEach(o => {
    const { pin, pins, ...conf } = o
    if (pin) custom.push({ pin, ...conf })
    if (pins) o.pins.forEach(pin => custom.push({ pin, ...conf }))
  })

  const table = defaults.map(d => {
    return Object.assign(d, custom.find(item => item.pin === d.pin) || {})
  })

  return table
}
