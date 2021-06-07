import Dep, { pushTarget, popTarget } from "./dep";

let id = 0;

class Watch {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm 
    this.getter = expOrFn;
    this.cb = cb
    this.options = options
    this.deps = []
    this.depIds = new Set()

    this.id = id++
    this.get()
  }

  // dep: Dep
  // 当前的watch实例内要添加所有dep
  // 调用了几次new 就证明有几个watch实例
  addDep(dep) {
    let id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)

      // 对象的每一个属性都对应一个dep
      // 每一个dep都对应一个或着多个watch
      // 所以每一个属性被修改时候，都会重新执行一次render
      // 执行render生成的vnode，会进行一次patch（dom diff）
      // dom diff之后触发页面的相应部分重新渲染
      dep.addSub(this) // 当前dep订阅当前watch
    }
  }

  get() {
    pushTarget(this)
    this.getter()
    this.cb()
    popTarget()
    // 既然所有的dep都已经加到watch中了
    // 那当前实例中存储的dep就没有用了
    this.cleanupDeps()
  }

  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.depIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    this.depIds.length = 0
  }

  update() {
    this.get()
  }
}

export function watch() {
  return new Watch(...arguments)
}

export default Watch