
<p align="center">
<h1 align="center">babel-plugin-enum-to-object</h1>
</p>

<div align="center">

[![NPM version][npm-image]][npm-url] ![NPM downloads][download-image]

![Test][test-badge] ![codecov][codecov-badge]


[npm-image]: https://img.shields.io/npm/v/babel-plugin-enum-to-object.svg?style=flat-square
[npm-url]: http://npmjs.org/package/babel-plugin-enum-to-object


[download-image]: https://img.shields.io/npm/dm/babel-plugin-enum-to-object.svg?style=flat-square



[test-badge]: https://github.com/baozouai/babel-plugin-enum-to-object/actions/workflows/ci.yml/badge.svg

[codecov-badge]: https://codecov.io/github/baozouai/babel-plugin-enum-to-object/branch/master/graph/badge.svg


</div>


中文 | [英文](./README.md)

## 关于

一个用来将 ts enum 转 js 对象的 babel 插件，使没使用到的 enum 能全部shaking 掉

eg:

没加插件前：
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

加插件后：
```ts
enum Status {
  PAID,
  UN_PAID
}

// =>

// 默认 reflect 是 true
const Status = {
  PAID: 0,
  0: 'PAID',
  UN_PAID: 1,
  1: 'UN_PAID'
}
//  设置 reflect 为false
const Status = {
  PAID: 0,
  UN_PAID: 1,
}
```


## 📦  安装

```sh
pnpm add babel-plugin-enum-to-object -D
# or
yarn add babel-plugin-enum-to-object -D
# or
npm i babel-plugin-enum-to-object -D
```

 ## 🔨 使用

```js


// babel.config.js

module.exports = {

  plugins: [
    // 如果是生产环境，添加这一行
    ['enum-to-object', { reflect: true or false }]
  ],
}
```
## 📄 License

babel-plugin-enum-to-object is [MIT licensed](./LICENSE).