# usrv

    The service container for seneca microservices

Usrv is an opinionated service container that makes it fun and easy to build seneca microservice.

- **Sponsor**: [37teams](https://www.37teams.com)
- **Status**: experimental

## Features

- **Easy**: Modernizes seneca with async await, and in general gets out of the way.
- **Simple**: Simplifies what you need to do to get up and running
- **Configurable**: To simplify things we have opinions, but you can change those.

## Installation

```bash
npm install usrv
```

## Usage

Create an `index.js` file and export a function that accepts an optional options object. The context of this function is seneca as is the standard for a seneca plugin.

```jsonld
// index.js

module.exports = (opts) => {
  const seneca = this

  seneca.message('my:pattern', async (msg) => {
      // can so some awaiting things here if needed...

      return {ok: true}
  })
}
```

If you want to/need to configure your service you can do so with
a `srvfile`. This needs to be at the root of your service (the same place your package.json is). The srvfile is just a js function that takes in the usrv [config object](srvfile.md) as allows you to mutate it. Once mutated, you simply return the [config object](srvfile.md)

```
// srvfile

module.exports = config => {

  config.name='name_service'

  // customize service container here...

  return config
}

```

Next, ensure that the `main` property inside `package.json` points to your microservice (which is inside `index.js` in this example case) and add a `start` script:

```json
{
  "main": "index.js",
  "scripts": {
    "start": "usrv"
  }
}
```

Accessing your service will depend on your transport configuration. If, for example, you want the above example case to be available at `http://localhost:3000` add the following config to the `srvfile`:

```js
module.exports = config => {
  config.listen = 3000

  return config
}
```

Once all of that is done, you can run the service with the following command:

```bash
npm start
```

And go to this URL: `http://localhost:3000` - 🎉

### Thanks

**usrv** would not be possible without the valuable open-source work of projects in the community. We would like to extend a special thank-you to [Richard Rodger](http://www.richardrodger.com/) and [Seneca](https://github.com/senecajs/seneca).
