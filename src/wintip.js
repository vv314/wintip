function query(selector) {
  return document.querySelectorAll(selector)
}

function likeNumber(value) {
  return !isNaN(Number(value))
}

function isElement(ele) {
  return typeof ele === 'object' && ele.nodeType === 1
}

function append(ele, html) {
  if (isElement(ele)) {
    ele.insertAdjacentHTML('beforeend', html)
  } else {
    query(ele)[0].insertAdjacentHTML('beforeend', html)
  }
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

function fillTipMsg(tipNode, idStr, msg) {
  const tipBox = query('._win_tip_box')[0]

  const tipHtml = `<span class="_win_tip ${idStr}" style="display: inline-block;min-width: 80px;padding: 8px;margin-bottom: 1px;background-color: rgba(0, 0, 0, ${settings.opacity});">${msg}</span><br>`

  const tipBoxHtml = `<div class="_win_tip_box" style="position: fixed;top: 0;left: 0;max-height: 75%;word-break: break-all;max-width: 55%;color: ${settings.color};font-size: 12px;z-index: 100;overflow: auto;text-shadow: 1px 1px rgba(0, 0, 0, 0.3);-webkit-overflow-scrolling: touch;">${tipHtml}</div>`

  if (tipNode) {
    tipNode.textContent = msg
  } else if (tipBox) {
    append(tipBox, tipHtml)

    // scroll to bottom
    tipBox.scrollTop = tipBox.offsetHeight
  } else {
    append('body', tipBoxHtml)
  }

  return tipNode || query(`.${idStr}`)[0]
}

winTip.remove = tip => {
  const node = isElement(tip) ? tip : query(`._tip_${tip}`)[0]
  if (node) {
    node.nextElementSibling.remove()
    node.remove()
  }
}

winTip.config = options => {
  Object.assign(settings, options)
}

winTip.$ = name => {
  const tipNode = query(`._tip_${name}`)[0]

  if ((likeNumber(name) && !tipNode) || !name) {
    throw new Error('[wintip]: name is not defined')
  }

  return function() {
    const idNo = query('._win_tip').length + 1
    const idStr = likeNumber(name)
      ? `_tip_${idNo}`
      : `_tip_${idNo} _tip_${name}`

    return settings.output
      ? fillTipMsg(
          tipNode,
          idStr,
          splitArgs(arguments, likeNumber(name) ? '' : name)
        )
      : null
  }
}

export default winTip
