import { declare } from '@babel/helper-plugin-utils'
// @ts-ignore
import syntaxTypeScript from '@babel/plugin-syntax-typescript'
import type { BinaryExpression } from '@babel/types'
import * as t from '@babel/types'
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

function getValueFromBinaryExpression(node: BinaryExpression, mapValue: Map<string | number, number | string>) {
  const { left, operator, right } = node
  let leftValue = 0
  let rightValue = 0

  if (t.isBinaryExpression(left))
    leftValue = getValueFromBinaryExpression(left, mapValue)
  else if (t.isNumericLiteral(left))
    leftValue = left.value
  else if (t.isIdentifier(left))
    leftValue = +mapValue.get(left.name)!
  if (t.isBinaryExpression(right))
    rightValue = getValueFromBinaryExpression(right, mapValue)
  else if (t.isNumericLiteral(right))
    rightValue = right.value
  else if (t.isIdentifier(right))
    rightValue = +mapValue.get(right.name)!
  if (operator === '+')
    return leftValue + rightValue

  if (operator === '-')
    return leftValue - rightValue

  if (operator === '*')
    return leftValue * rightValue

  if (operator === '/')
    return leftValue / rightValue

  if (operator === '%')
    return leftValue % rightValue

  if (operator === '**')
    return leftValue ** rightValue

  if (operator === '<<')
    return leftValue << rightValue

  if (operator === '>>')
    return leftValue >> rightValue

  if (operator === '>>>')
    return leftValue >>> rightValue

  if (operator === '|')
    return leftValue | rightValue

  if (operator === '^')
    return leftValue ^ rightValue

  if (operator === '&')
    return leftValue & rightValue

  return 0
}
export default declare<BabelPluginEnumToObjectOptions>((api, options) => {
  api.assertVersion(7)
  const { types: t } = api
  const { reflect = true } = options
  return {
    name: 'enum-to-object',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    inherits: syntaxTypeScript,
    visitor: {
      TSEnumDeclaration(path) {
        const { node } = path
        const { id, members } = node
        let preNum = -1
        const targetMap = new Map<string | number, number | string>()

        members.forEach((member) => {
          let { initializer, id: memberId } = member
          if (!initializer) {
            preNum++
            initializer = t.numericLiteral(preNum)
          }
          else if (t.isNumericLiteral(initializer)) {
            preNum = initializer.value
          }
          let key = ''
          if (t.isIdentifier(memberId))
            key = memberId.name
          else
            key = memberId.value

          let value: number | string = preNum
          if (t.isStringLiteral(initializer))
            value = initializer.value

          else if (t.isBinaryExpression(initializer))
            value = getValueFromBinaryExpression(initializer, targetMap)

          targetMap.set(key, value)

          if (reflect)
            targetMap.set(value, key)
        })
        const obj = t.variableDeclarator(
          id,
          t.objectExpression(
            [...targetMap.entries()].map(([key, value]) => t.objectProperty(t.identifier(String(key)), typeof value === 'string' ? t.stringLiteral(value) : t.numericLiteral(value))),
          ),
        )
        const constObjVariable = t.variableDeclaration('const', [obj])

        path.replaceWith(constObjVariable)
      },
    },
  }
})
