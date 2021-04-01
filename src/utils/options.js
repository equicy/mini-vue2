export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'mounted',
  'beforeUpdate',
  'updated'
]
let strats = {}
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook=> {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}

  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (parent && !parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else if(isObject(parent[key]) && isObject(child[key])) {
      options[key] = Object.assign(parent[key], child[key])
    } else {
      if (child[key] == null) {
        options[key] = parent[key]
      } else {
        options[key] = child[key]
      }
    }
  }
  return options
}