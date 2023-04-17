import { declare } from '@babel/helper-plugin-utils'
// @ts-ignore
import syntaxTypeScript from '@babel/plugin-syntax-typescript'
import type { NumericLiteral, ObjectProperty, StringLiteral } from '@babel/types'

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
        const objProperties: ObjectProperty[] = []
        let preNum = -1
        members.forEach((member) => {
          let { initializer, id: memberId } = member
          if (!initializer) {
            preNum++
            initializer = t.numericLiteral(preNum)
          }
          else if (t.isNumericLiteral(initializer)) {
            preNum = initializer.value
          }
          const objProerty = t.objectProperty(memberId, initializer)
          objProperties.push(objProerty)

          if (reflect) {
            // add reflect
            const key = t.identifier(String((objProerty.value as StringLiteral | NumericLiteral).value))
            const value = t.stringLiteral(t.isIdentifier(memberId) ? memberId.name : memberId.value)
            if (key.name === value.value)
              return
            objProperties.push(
              t.objectProperty(
                t.identifier(String((objProerty.value as StringLiteral | NumericLiteral).value)),
                t.stringLiteral(t.isIdentifier(memberId) ? memberId.name : memberId.value),
              ),
            )
          }
        })

        const obj = t.variableDeclarator(
          id,
          t.objectExpression(objProperties),
        )
        const constObjVariable = t.variableDeclaration('const', [obj])

        path.replaceWith(constObjVariable)
      },
    },
  }
})
