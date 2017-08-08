import './style.css'

function query(selector) {
  return document.querySelectorAll(selector)
}

function likeNumber(value) {
  return !isNaN(Number(value))
}

function isElement(target) {
  return typeof target === 'object' && target.nodeType === 1
}

function isFunc(target) {
  return typeof target === 'function'
}

function append(ele, html) {
  if (isElement(ele)) {
    ele.insertAdjacentHTML('beforeend', html)
  } else {
    query(ele)[0].insertAdjacentHTML('beforeend', html)
  }
}

const context = {
  tips: {}
}

const settings = {
  output: true,
  opacity: 0.75,
  color: '#fff'
}

function winTip() {
  const idNo = query('._win_tip').length + 1
  const idStr = `_tip_${idNo}`
  const tipNode = query(`.${idStr}`)[0]

  return settings.output
    ? fillTipMsg(tipNode, idStr, splitArgs(arguments))
    : null
}

function splitArgs(args, name) {
  let res = ''
  ;[].slice.call(args).forEach(e => {
    res += ' ' + (typeof e === 'object' ? JSON.stringify(e) : e)
  })

  return (name ? `[${name}] ` : '') + res.substring(1)
}

function genTipHtml(idStr, msg, options) {
  return `<span class="_win_tip ${idStr}">${msg}</span><br>`
}

function genTipBoxHtml(tipHtml) {
  return `<div class="_win_tip_box">${tipHtml}</div>`
}

function decorateTip(tipNode, options) {
  if (!options) return tipNode

  if (options.color) {
    tipNode.style.color = options.color
  }

  return tipNode
}

function fillTipMsg(tipNode, idStr, msg, options) {
  const tipBox = query('._win_tip_box')[0]
  const tipHtml = genTipHtml(idStr, msg, options)

  if (tipNode) {
    tipNode.textContent = msg
    return decorateTip(tipNode, options)
  }

  if (tipBox) {
    append(tipBox, tipHtml)

    // scroll to bottom
    tipBox.scrollTop = tipBox.scrollHeight
  } else {
    append('body', genTipBoxHtml(tipHtml))
  }

  return query(`.${idStr}`)[0]
}

function generateTipfn(name, tipNode, options) {
  const tipFn = function() {
    const idNo = query('._win_tip').length + 1
    const idStr = likeNumber(name)
      ? `_tip_${idNo}`
      : `_tip_${idNo} _tip_${name}`

    return settings.output
      ? fillTipMsg(
          tipNode,
          idStr,
          splitArgs(arguments, likeNumber(name) ? '' : name),
          options
        )
      : null
  }

  tipFn['__name'] = name

  return tipFn
}

winTip.remove = tip => {
  const node = isElement(tip)
    ? tip
    : query(`._tip_${isFunc(tip) ? tip['__name'] : tip}`)[0]

  if (node) {
    node.nextElementSibling.remove()
    node.remove()
  }
  tip = null
}

winTip.config = options => {
  Object.assign(settings, options)
}

winTip.$ = (name, options = {}) => {
  const tipNode = query(`._tip_${name}`)[0]

  if ((likeNumber(name) && !tipNode) || !name) {
    throw new Error('[wintip]: name is not defined')
  }

  return generateTipfn(name, tipNode, options)
}

export default winTip
