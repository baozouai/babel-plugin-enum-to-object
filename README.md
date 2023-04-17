
<p align="center">
<h1 align="center">babel-plugin-enum-to-object</h1>
</p>

<div align="center">


 [![NPM version][npm-image]][npm-url] ![NPM downloads][download-image]

[npm-image]: https://img.shields.io/npm/v/babel-plugin-enum-to-object.svg?style=flat-square
[npm-url]: http://npmjs.org/package/babel-plugin-enum-to-object


[download-image]: https://img.shields.io/npm/dm/babel-plugin-enum-to-object.svg?style=flat-square
[download-url]: https://npmjs.org/package/babel-plugin-enum-to-object


</div>

English | [中文](./README-zh_CN.md)
## About

A babel Plugin to transform ts enum to object，for better shaking


## Options

```ts
  interface BabelPluginEnumToObjectOptions {
  /**
   * need reflect ? default true
   * @example
   * enum Status {
   *  PAID
   * }
   * reflect: true
   * =>
   * const Status = {
   * PAID: 0,
   * 0: 'PAID',
   * }
   * reflect: false
   * =>
   * const Status = {
   * PAID: 0,
   * }
   */
  reflect?: boolean
}
```
eg:

before add plugin：
```ts
enum Status {
  PAID,
  UN_PAID
}

// =>

var Status;
(function (Status) {
  Status[Status.PAID = 0] = 'PAID'
  Status[Status.UN_PAID = 1] = 'UN_PAID'
})(Status || (Status = {}))
```

after add plugin：
```ts
enum Status {
  PAID,
  UN_PAID
}

// =>
// default (reflect is true)
const Status = {
  PAID: 0,
  0: 'PAID',
  UN_PAID: 1,
  1: 'UN_PAID'
}
//  set reflect false
const Status = {
  PAID: 0,
  UN_PAID: 1,
}
```


## 📦  Install

```sh
pnpm add babel-plugin-enum-to-object -D
# or
yarn add babel-plugin-enum-to-object -D
# or
npm i babel-plugin-enum-to-object -D
```

##  🔨 Usage

```js
// babel.config.js

module.exports = {

  plugins: [
    // if isProduction add this
    ['enum-to-object', { reflect: true or false }]
  ],
}
```
## 📄 License

babel-plugin-enum-to-object is [MIT licensed](./LICENSE).