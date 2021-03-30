import { initMixin } from './core/init'
import { renderMixin } from './core/render'
import { lifeCycleMixin } from './core/lifecycle'

function Vue(options) {
  this.options = options
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue);
export default Vue