
import { compileToFunctions } from '../compiler/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from '../utils/options'
import { initState } from '../core/state'

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated'
]

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {

    const vm = this
    vm.$options = mergeOptions(vm.constructor.options || {}, options)

    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    const el = this.options.el
    if (el) {
      this.$mount(el)
    }
  }

  Vue.prototype.$mount = function(el) {
    this.$el = document.querySelector(el)
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
}

function initLifecycle() {}
function initEvents() {}
function initRender() {}
function initInjections() {}
function initProvide() {}