
import { parseHTML } from './parse'
import { generate } from './generate'

export const compileToFunctions = function(template) {
  const ast = parseHTML(template)
  const code = generate(ast)

  const render = new Function(code)

  return render
}