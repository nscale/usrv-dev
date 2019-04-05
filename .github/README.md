# usrv

    The service container for seneca microservices

Usrv is an opinionated service container that makes it fun and easy to build seneca microservice. While usrv can be used on its own its intended for use with [nscale](https://www.npmjs.com/package/nscale).

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

```js
// index.js

module.exports = opts => {
  const seneca = this

  seneca.message('my:pattern', async msg => {
    // can so some awaiting things here if needed...

    return { ok: true }
  })
}
```

If you want to/need to configure your service you can do so with
a `srvfile`. This needs to be at the root of your service (the same place your package.json is). The srvfile is just a js function that takes in the usrv [config object](srvfile.md) and allows you to mutate it.

```
// srvfile

module.exports = config => {
  // customize service config here...

  config.name = 'name_service'

  // ...
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

Accessing your service will depend on your transport configuration. If, for example, you want the above example case to be available at `http://localhost:3000`, create a `srvfile` add the following config:

```js
// usrv assumes its being run as part of a service mesh.
// It currently supports seneca-mesh or seneca-divy.
// See below on how to use usrv in a mesh.
module.exports = config => {
  config.transport.mesh = 'none'
  config.transport.listen = 3000
}
```

Once all of that is done, you can run the service with the following command:

```bash
npm start
```

And go to this URL: `http://localhost:3000` - 🎉

## Handling Enviroment specific srvfiles

It's likely you will need to have some specific config for the enviroments your service will run in such as `development` vs `production`.
usrv uses the `srvfile` as default if present. You can override it by adding a srvfile for an enviroment. So if you needed a srvfile for `development` you would create a file named `srvfile.development` and set your `NODE_ENV` enviroment variable to `development`.

So again, the look up pattern is `srvfile.[NOD_ENV]` with it defaulting to `srvfile` if no specific file exists.

**note:** The file extension is a lowercase form of the env var. So if you NODE_ENV var is set to `PRODUCTION` usrv will look for a file `srvfile.production`. It will obviously not mutate the env value.

### Thanks

**usrv** would not be possible without the valuable open-source work of projects in the community. We would like to extend a special thank-you to [Richard Rodger](http://www.richardrodger.com/) and [Seneca](https://github.com/senecajs/seneca).
