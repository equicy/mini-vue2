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
  addDep(dep) {
    let id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)

      dep.addSub(this) // 当前dep订阅当前watch
    }
  }

  get() {
    pushTarget(this)
    this.getter()
    this.cb()
    popTarget()
  }

  update() {
    this.get()
  }
}

export function watch() {
  return new Watch(...arguments)
}

export default Watch