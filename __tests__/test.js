/* global it, expect */

import { transformAsync } from '@babel/core'
import plugin from '../dist/babel-plugin-enum-to-object2'

const defaultOptions = {
  plugins: [plugin],
  generatorOpts: {
    jsescOption: {
      quotes: 'single',
    },
  },

}

const noReflectOptions = {
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
}
`

it('Transforms NumericLiteral enum', async () => {
  const { code: output } = await transformAsync(numberEnumInput, defaultOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms string enum', async () => {
  const { code: output } = await transformAsync(stringEnumInput, defaultOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms string number mix', async () => {
  const { code: output } = await transformAsync(mixEnumInput, defaultOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms calc enum', async () => {
  const { code: output } = await transformAsync(calcEnumInput, defaultOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms NumericLiteral enum  with reflect false', async () => {
  const { code: output } = await transformAsync(numberEnumInput, noReflectOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms string enum  with reflect false', async () => {
  const { code: output } = await transformAsync(stringEnumInput, noReflectOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms string number mix  with reflect false', async () => {
  const { code: output } = await transformAsync(mixEnumInput, noReflectOptions)
  expect(output).toMatchSnapshot()
})

it('Transforms calc enum  with reflect false', async () => {
  const { code: output } = await transformAsync(calcEnumInput, noReflectOptions)
  expect(output).toMatchSnapshot()
})
