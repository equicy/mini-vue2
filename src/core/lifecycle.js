
import { watch } from '../observer/watcher'
import { patch } from '../vdom/patch'

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    const prevVnode = vm._vnode
    vm._vnode = vnode

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
  }
}


export function mountComponent(vm, el) {
  // Vue在渲染的过程中 会创建一个 所谓的“渲染watcher ” 只用来渲染的
  // watcher就是一个回调 每次数据变化 就会重新执行watcher

  callHook(vm, 'beforeMount')
  const updateComponent = () => {
      // 内部会调用刚才我们解析后的render方法 =》 vnode
      // _render => options.render 方法
      // _update => 将虚拟dom 变成真实dom 来执行
      vm._update(vm._render());
  }

  // 每次数据变化 就执行 updateComponent 方法 进行更新操作
  // watch会传一个回调，只是用户创建的watch和框架自身创建的watch
  // 框架自身创建的watch是执行render更新dom
  watch(
    vm, 
    updateComponent,
    function () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    },
    true
  );

  vm._isMounted = true
  callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
  let handlers = vm.options[hook]; // 典型的发布订阅模式
  if (handlers) {
      for (let i = 0; i < handlers.length; i++) { // [fn,fn,fn]
          handlers[i].call(vm); // 所有的生命周期的this 指向的都是当前的实例
      }
  }
}