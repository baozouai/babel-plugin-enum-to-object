import { expect, it } from 'vitest'
import type { TransformOptions } from '@babel/core'
import { transformSync } from '@babel/core'
import plugin from '../src/babel-plugin-enum-to-object'

const defaultOptions: TransformOptions = {
  plugins: [plugin],
  generatorOpts: {
    jsescOption: {
      quotes: 'single',
    },
  },

}

const noReflectOptions: TransformOptions = {
  plugins: [[plugin, { reflect: false }]],
  generatorOpts: {
    jsescOption: {
      quotes: 'single',
    },
  },
}
const numberEnumInput = `export enum Direction {
  Up,
  Down,
  Left,
  Right,
}  
`
const stringEnumInput = `export enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}`

const mixEnumInput = `export enum Status {
  PAID,
  UNPAID = '21',
  PART = 44,
  HALF
}
`

const calcEnumInput = `export enum MyEnum {
  A,
  B,
  C = 20,
  D,
  E = B * C * D * 10,
  F = E - 1,
  G = F + 1 + 2,
  H = G / 2,
  I = H % 2 + 4,
  J = E ** 3,
  K = E << 2,
  L = E >> 2,
  M = E >>> 1,
  N = E + 1 & 1,
  O = E | 2 + 1,
  P = E ^ 2,
}
`

it('Transforms NumericLiteral enum', () => {
  const { code } = transformSync(numberEnumInput, defaultOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms string enum', () => {
  const { code } = transformSync(stringEnumInput, defaultOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms string number mix', () => {
  const { code } = transformSync(mixEnumInput, defaultOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms calc enum', () => {
  const { code } = transformSync(calcEnumInput, defaultOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms NumericLiteral enum  with reflect false', () => {
  const { code } = transformSync(numberEnumInput, noReflectOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms string enum  with reflect false', () => {
  const { code } = transformSync(stringEnumInput, noReflectOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms string number mix  with reflect false', () => {
  const { code } = transformSync(mixEnumInput, noReflectOptions)!
  expect(code).toMatchSnapshot()
})

it('Transforms calc enum  with reflect false', () => {
  const { code } = transformSync(calcEnumInput, noReflectOptions)!
  expect(code).toMatchSnapshot()
})
