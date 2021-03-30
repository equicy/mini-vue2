
import Observer from "../observer"
import { compileToFunctions } from '../compiler/index'
import { mountComponent } from './lifecycle'

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated'
]

function proxy(target,property,key){
  Object.defineProperty(target,key,{
      get(){
          return target[property][key];
      },
      set(newValue){
          target[property][key] = newValue
      }
  })
}

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    this.initData(options)

    const el = this.options.el
    this.$mount(el)
  }

  Vue.prototype.initData = function(options) {
    if (!options.data) return
    let data = options.data

    data = this._data = typeof data === 'function' ? data.call(vm) : data;

    for(let key in data){
      proxy(this,'_data',key);
    }
    new Observer(data)
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