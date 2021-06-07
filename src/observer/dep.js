let uid = 0
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [] // 所有的watcher
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // sub: Watcher
  // 每一个dep内的subs内都添加要添加所有对应的watch
  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  notify() {
    const subs = this.subs.slice()

    for (var i =0, l= subs.length; i< l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []

// target: Watcher
export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()

  Dep.target = targetStack[targetStack.length - 1]
}

export default Dep