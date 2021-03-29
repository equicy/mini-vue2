import Observer from "./observer"
import { compileToFunctions } from './compiler/index'
import { mountComponent } from './core/lifecycle'

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated'
]

function Vue(options) {
  this.options = options

  this.initData(options)

  const el = this.options.el
  this.$mount(el)
}

Vue.prototype.initData = function(options) {
  if (!options.data) return

  this.data = options.data

  new Observer(options.data)
}

Vue.prototype.$mount = function(el) {
  const options = this.options

  if (!options.render) {
    let template = options.template
    if (!template) {
      template = getOuterHTML(el)
    }

    const render = compileToFunctions(template)
    this.options.render = render
    this._render = render
  }

  LIFECYCLE_HOOKS.forEach(hook=>{
    options[hook] = function(){}
  })

  mountComponent(this, el)
}

function getOuterHTML (el) {
  el = document.querySelector(el)
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
export default Vue