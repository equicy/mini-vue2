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

    if (oldVnode.tag !== newVnode.tag) {
      oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
    }
    // 如果是文本
    if (!oldVnode.tag) {
      if(oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text
      }
    }

    let el = newVnode.el = oldVnode.el

    updateProperties(newVnode, oldVnode.data)

    let oldChildren = oldVnode.children || []
    let newChildren = newVnode.children || []

    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      for (let i=0; i< newChildren.length; i++) {
        let child = newChildren[i]
        el.appendChild(createElm(child))
      }
    }
    return el
  }
}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.key == newVnode.key) && (oldVnode.tag == newVnode.tag)
}

function updateChildren(parent, oldChildren, newChildren) {
  
  // old
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length -1
  let oldEndVnode = oldChildren[oldEndIndex]

  // new
  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode,  newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 比较旧结点尾元素和新结点开始元素，执行patchVnode，将旧元素尾元素移动到旧元素开始，旧元素尾左移一位，新元素开始右移一位
      // 如果给定的子节点是对文档中现有节点的引用，insertBefore(插入的元素，目标位置) 会将其从当前位置移动到新位置
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
    } else {
      let moveIndex = map[newStartVnode.key]
      if (moveIndex == undefined) { // 新元素
        parent.insertBefore(createElm(newStartVnode), oldStartVnode)
      } else {
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null // 移除老的元素

        // 虽然这个两个元素不同，但是也要比较他们的孩子节点
        patch(moveVnode, newStartVnode)
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartVnode] // 移除掉新的指针
    }
  }

  if(newStartIndex <= newEndIndex) {
    for (let i = newStartIndex;  i<= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1]
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i=oldStartIndex; i<=oldEndIndex;  i++) {
      let child = oldChildren[i]
      if (child !=null) {
        parent.removeChild(child.el)
      }
    }
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