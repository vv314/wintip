import './style.css'

const BOX_CLASS_NAME = '_win_tip_box'
const TIP_CLASS_NAME = '_win_tip'
const TIP_ID_PREFIX = '_tip_'
const TIP_FUNC_NAME = '__name'

// start from 1
let tipNo = 1

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

const settings = {
  output: true,
  opacity: 0.75,
  color: '#fff'
}

function winTip(...args) {
  const idStr = getNewTipId()
  const tipNode = query(`.${idStr}`)
  const output = settings.output && args.length

  return output ? fillTipMsg(tipNode, [idStr], splitArgs(args)) : void 0
}

function getNewTipId(name) {
  name = typeof name === 'undefined' ? tipNo++ : name

  return TIP_ID_PREFIX + name
}

function splitArgs(args, name) {
  const res = args
    .map(e => (typeof e === 'object' ? JSON.stringify(e) : e))
    .join(' ')

  return name ? `[${name}] ${res}` : res
}

function genTipFragment(idArr, msg, options) {
  const fragment = document.createDocumentFragment()
  const tip = createEl('span')

  tip.className = [TIP_CLASS_NAME, ...idArr].join(' ')
  tip.textContent = msg

  append(fragment, tipDecorator(tip, options))
  append(fragment, createEl('br'))

  return fragment
}

function genTipBoxNode(fragment) {
  const box = createEl('div')

  box.className = BOX_CLASS_NAME
  box.style.color = settings.color

  return append(box, fragment)
}

function tipDecorator(tipNode, options) {
  // handle global option firstly
  if (settings.opacity != 0.75) {
    tipNode.style.backgroundColor = `rgba(0, 0, 0, ${settings.opacity})`
  }

  if (!options) return tipNode

  if (options.color) {
    tipNode.style.color = options.color
  }

  return tipNode
}

function fillTipMsg(tipNode, idArr, msg, options) {
  const tipBox = query(`.${BOX_CLASS_NAME}`)
  const tipFragment = genTipFragment(idArr, msg, options)

  if (tipNode) {
    tipNode.textContent = msg
    return tipDecorator(tipNode, options)
  }

  if (tipBox) {
    append(tipBox, tipFragment)

    // scroll to bottom
    tipBox.scrollTop = tipBox.scrollHeight
  } else {
    append(document.body, genTipBoxNode(tipFragment))
  }

  return query(`.${idArr.join(' .')}`)
}

function generateTipFn(name = '', tipNode, options) {
  function tipFn(...args) {
    const idArr = likeNumber(name)
      ? [getNewTipId()]
      : [getNewTipId(), getNewTipId(name)]
    const output = settings.output && args.length

    return output
      ? fillTipMsg(
          tipNode || query(`.${getNewTipId(name)}`),
          idArr,
          splitArgs(args, likeNumber(name) ? '' : name),
          options
        )
      : null
  }

  tipFn[TIP_FUNC_NAME] = name

  return tipFn
}

winTip.remove = tip => {
  let node = null

  if (!tip) return

  if (isElement(tip)) {
    node = tip
  } else if (isFunc(tip)) {
    node = query(`.${getNewTipId(tip[TIP_FUNC_NAME])}`)
  } else if (likeNumber(tip)) {
    node = querys(`.${TIP_CLASS_NAME}`)[tip]
  } else {
    node = query(`.${getNewTipId(tip)}`)
  }

  if (!node) return

  node.nextElementSibling.remove()
  node.remove()
}

winTip.config = options => {
  Object.assign(settings, options)
}

winTip.$ = (name, options = {}) => {
  if (typeof name === 'object') return generateTipFn('', null, name)

  const tipNode = query(`.${getNewTipId(name)}`)

  if (likeNumber(name) && !tipNode) {
    throw new Error(`[wintip]: name ${name} is not defined`)
  }

  return generateTipFn(name, tipNode, options)
}

export default winTip
