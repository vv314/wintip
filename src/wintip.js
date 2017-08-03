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
  opacity: 0.75
}

function winTip(msg) {
  const idNo = query('._win_tip').length + 1
  const idStr = `_tip_${idNo}`
  const tip = query(`.${idStr}`)
  const tipBox = query('._win_tip_box')

  if (!settings.output) return

  const tipHtml = `<span class="_win_tip ${idStr}" style="display: inline-block;min-width: 80px;padding: 8px;margin-bottom: 1px;background-color: rgba(0, 0, 0, ${settings.opacity});">${msg}</span><br>`

  const tipBoxHtml = `<div class="_win_tip_box" style="position: fixed;top: 0;left: 0;max-height: 75%;word-break: break-all;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: auto;-webkit-overflow-scrolling: touch;">${tipHtml}</div>`

  if (tip.length) {
    tip[0].textContent = msg
  } else if (tipBox.length) {
    append(tipBox[0], tipHtml)
  } else {
    append('body', tipBoxHtml)
  }

  return tip
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
  const idNo = query('._win_tip').length + 1
  const tip = query(`._tip_${name}`)
  const tipBox = query('._win_tip_box')

  if (likeNumber(name) && !tip.length) {
    return alert(`wintip: ${name} is not defined`)
  }

  return function(msg) {
    const idStr =
      likeNumber(name) || typeof name === 'undefined'
        ? `_tip_${idNo}`
        : `_tip_${idNo} _tip_${name}`

    const tipHtml = `<span class="_win_tip ${idStr}" style="display: inline-block;min-width: 80px;padding: 8px;margin-bottom: 1px;background-color: rgba(0, 0, 0, ${settings.opacity});">${msg}</span><br>`

    const tipBoxHtml = `<div class="_win_tip_box" style="position: fixed;top: 0;left: 0;max-height: 75%;word-break: break-all;max-width: 55%;color: #fff;font-size: 12px;z-index: 100;overflow: auto;-webkit-overflow-scrolling: touch;">${tipHtml}</div>`

    if (tip.length) {
      tip[0].textContent = msg
    } else if (tipBox.length) {
      append(tipBox[0], tipHtml)
    } else {
      append('body', tipBoxHtml)
    }

    return tip
  }
}

export default winTip
