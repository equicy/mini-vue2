export function patch(oldVnode, newVnode) {
  const isRealElement = oldVnode.nodeType

  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    const el = createElm(newVnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldVnode)
    return el
  } else {

  }
}

export function createElm(vnode) {
  let { tag, children, data, key, text } = vnode
  if (typeof tag == 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  const el = vnode.el
  const newProps = vnode.data || {}
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}

  for(let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  for (let key in newProps) {
    if (key == 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}