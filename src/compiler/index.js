
import { parseHTML } from './parse'
import { generate } from './generate'

export const compileToFunctions = function(template) {
  const ast = parseHTML(template)
  let code = generate(ast)
  code = `with(this){ \r\nreturn ${code} \r\n}`

  const render = new Function(code)

  return render
}