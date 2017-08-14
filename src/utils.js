function query(selector) {
  return document.querySelector(selector)
}

function querys(selector) {
  return document.querySelectorAll(selector)
}

function createEl(tag) {
  return document.createElement(tag)
}

function likeNumber(value) {
  return !isNaN(Number(value))
}

function isElement(target) {
  // Element or Fragment
  return (
    (typeof target === 'object' && target.nodeType === 1) ||
    target.nodeType === 11
  )
}

function isFunc(target) {
  return typeof target === 'function'
}

function append(ele, dom) {
  ele = isElement(ele) ? ele : query(ele)
  ele.appendChild(dom)

  return ele
}

function space2dash(str) {
  return str.replace(/\s+/g, '_')
}

export {
  query,
  querys,
  createEl,
  likeNumber,
  isElement,
  isFunc,
  append,
  space2dash
}
