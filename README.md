# usrv

    The service container for seneca microservices

Usrv is an opinionated service container that makes it fun and easy to build seneca microservice.

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

## More then just a function

It may look like usrv pushes you down the road of single independent "functions". While think being able to go down to that level is interesting, it shouldn't be a limitation. With that, you can still use seneca plugins.

To define a plugin simple add this to your `srvfile`:

```js
module.exports = config => {
  config.plugins = ['seneca-user', './my-local-plugin']
}
```

The plugins array items can be:

- string; npm package name
- string; path to module relative to the srvfile
- object; {plugin: 'string options mentioned about', options: {}}
  - plugin - same as string options above
  - options - and object which gets passed in to the plugin function

As mentioned, any local plugins will be imported relative to the `srvfile`. That said, you can override this by adding the follow to srvfile:

```js
module.exports = config => {
  config.relativeTo = 'path/to/my/plugins'
}
```

This will import all local plugins relative to that provided path.

## Within a service mesh

usrv by default assumes its apart of a service mesh. The above examples showed you how to diable that and use the basic http listener. Here we will exploring using usrv within the context of both divy service mesh and seneca mesh.

### Divy Mesh

[TODO]

### Seneca Mesh

[TODO]

## Handling Enviroment specific srvfiles

It's likely you will need to have some specific config for the enviroments your service will run in such as `development` vs `production`.
usrv uses the `srvfile` as default if present. You can override it by adding a srvfile for an enviroment. So if you needed a srvfile for `development` you would create a file named `srvfile.development` and set your `NODE_ENV` enviroment variable to `development`.

So again, the look up pattern is `srvfile.[NOD_ENV]` with it defaulting to `srvfile` if no specific file exists.

**note:** The file extension is a lowercase form of the env var. So if your NODE_ENV var is set to `PRODUCTION` usrv will look for a file `srvfile.production`. It will obviously **not** mutate the env value.

### Thanks

**usrv** would not be possible without the valuable open-source work of projects in the community. We would like to extend a special thank-you to [Richard Rodger](http://www.richardrodger.com/) and [Seneca](https://github.com/senecajs/seneca).
