function query(selector: any) {
  return isString(selector) ? document.querySelector(selector) : null
}

function querys(selector: string) {
  return document.querySelectorAll(selector)
}

function createEl(tag: string) {
  return document.createElement(tag)
}

function likeNumber(value: any): value is number {
  return !isNaN(Number(value))
}

function isElement(target: any): target is Element | DocumentFragment {
  // Element or Fragment
  return (
    (typeof target === 'object' && target.nodeType === 1) ||
    target.nodeType === 11
  )
}

function isFunc(target: any): target is Function {
  return typeof target === 'function'
}

function isString(target: any): target is string {
  return typeof target === 'string'
}

function append(ele: Node, dom: Node): Node
function append(ele: Node | string, dom: Node): Node | null {
  const node = isElement(ele) ? ele : query(ele)

  node && node.appendChild(dom)

  return node
}

function space2dash(str: string) {
  return str.replace(/\s+/g, '_')
}

function stringify(obj: any) {
  try {
    return JSON.stringify(obj)
  } catch (e) {
    console.error('[wintip]', `can't print object`, obj)
    return ''
  }
}

export {
  append,
  createEl,
  isElement,
  isFunc,
  likeNumber,
  query,
  querys,
  space2dash,
  stringify
}
