import { isObject } from '../utils/options';
import Dep from './dep'
const defineReactive = (obj, key) => {
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj);
  let val = obj[key]
  if (property && property.configurable === false) return;

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }

      return val
    },

    set(nval) {
      if (nval === val) return

      val = nval
      dep.notify()
    }
  })
}

class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    const keys = Object.keys(data);
    for(let i=0; i< keys.length; i++) {
      defineReactive(data, keys[i])
    }
  }
}

export function observer(data) {
  if (!isObject(data)) {
    return
  }

  // 防止重复监听
  if (data.__ob__ instanceof Observer) {
    return
  }

  return new Observer(data)
}

export default Observer