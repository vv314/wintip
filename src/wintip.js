import './style.css'
import {
  query,
  querys,
  createEl,
  likeNumber,
  isElement,
  isFunc,
  append,
  space2dash,
  stringify
} from './utils.js'

const BOX_CLASS_NAME = '_win_tip_box'
const TIP_CLASS_NAME = '_win_tip'
const TIP_ID_PREFIX = '_tip_'
const BOX_SLEEP = '_win_tip_box--sleep'
const TIP_FUNC_NAME = '__name'
const WARN_COLOR = '#fee381'
const ERROR_COLOR = '#ff4545'
const WEAK_TIME = 30 * 1000

// start from 1
let tipNo = 1
let sleepTimer = 0
const log = console.log

const settings = {
  // 'default', 'info', 'warn', 'error'
  output: 'default',
  console: false,
  opacity: 0.75,
  color: '#fff'
}

function consoleProxy(flag) {
  const mlog = function(...args) {
    winTip.apply(winTip, args)
    log.apply(console, args)
  }

  console.log = flag ? mlog : log
}

function isShow(level = 'default') {
  const ranking = ['default', 'info', 'warn', 'error']
  const outputLevel =
    ranking.indexOf(settings.output) < 0
      ? ranking.length
      : ranking.indexOf(settings.output)

  return ranking.indexOf(level) >= outputLevel || settings.output === true
}

function winTip(...args) {
  const idStr = getNewTipId()
  const tipNode = query(`.${idStr}`)
  const output = isShow('default') && args.length

  // return a empty object({}) when output is false
  // normaly return a Element object
  return output ? renderTip(tipNode, [idStr], splitArgs(args)) : {}
}

function getNewTipId(name) {
  name = name === void 0 ? tipNo++ : name

  return space2dash(TIP_ID_PREFIX + name)
}

function splitArgs(args, name) {
  const res = args
    .map(e => (typeof e === 'object' ? stringify(e) : `${e}`))
    .join(' ')

  return name ? `[${name}] ${res}` : res
}

function createTipFragment(idArr, msg, opts) {
  const fragment = document.createDocumentFragment()
  const tip = createEl('span')

  tip.className = [TIP_CLASS_NAME, ...idArr].join(' ')
  tip.textContent = msg

  append(fragment, tipDecorator(tip, opts))
  append(fragment, createEl('br'))

  return fragment
}

function createTipBox(fragment) {
  const box = createEl('div')

  box.className = BOX_CLASS_NAME
  box.style.color = settings.color
  box.onclick = () => weakUp(box)

  return append(box, fragment)
}

function weakUp(tipBox) {
  clearTimeout(sleepTimer)
  tipBox.classList.remove(BOX_SLEEP)
  setTimeout(sleep, WEAK_TIME, tipBox)
}

function sleep(tipBox) {
  tipBox.classList.add(BOX_SLEEP)
}

function tipDecorator(tipNode, opts) {
  // handle global option firstly
  if (settings.opacity != 0.75) {
    tipNode.style.backgroundColor = `rgba(0, 0, 0, ${settings.opacity})`
  }

  if (!opts) return tipNode

  const { color, level } = opts

  if (color) tipNode.style.color = color

  if (level) tipNode.dataset.level = level

  return tipNode
}

function renderTip(tipNode, idArr, msg, opts) {
  const tipBox = query(`.${BOX_CLASS_NAME}`)
  const tipFragment = createTipFragment(idArr, msg, opts)

  if (tipNode) {
    tipNode.textContent = msg
    return tipDecorator(tipNode, opts)
  }

  if (tipBox) {
    append(tipBox, tipFragment)

    // scroll to bottom
    tipBox.scrollTop = tipBox.scrollHeight
    weakUp(tipBox)
  } else {
    append(document.body, createTipBox(tipFragment))
  }

  return query(`.${idArr.join(' .')}`)
}

function wintipFactory(name, tipNode, opts) {
  function tipFn(...args) {
    const idArr = likeNumber(name)
      ? [getNewTipId()]
      : [getNewTipId(), getNewTipId(name)]
    const output = isShow(opts.level) && args.length

    return output
      ? renderTip(
          tipNode || query(`.${getNewTipId(name)}`),
          idArr,
          splitArgs(args, likeNumber(name) ? '' : name),
          opts
        )
      : null
  }

  tipFn[TIP_FUNC_NAME] = name

  return tipFn
}

winTip.remove = tip => {
  if (!tip) return

  const node = isElement(tip)
    ? tip
    : isFunc(tip)
      ? query(`.${getNewTipId(tip[TIP_FUNC_NAME])}`)
      : likeNumber(tip)
        ? querys(`.${TIP_CLASS_NAME}`)[tip]
        : query(`.${getNewTipId(tip)}`)

  if (!node) return

  node.nextElementSibling.remove()
  node.remove()
}

winTip.config = opts => {
  Object.assign(settings, opts)

  // consoleProxy is 'default' level
  consoleProxy(isShow('default') && settings.console)
}

winTip.$ = (name, opts = {}) => {
  if (name && typeof name === 'object') return wintipFactory('', null, name)

  const tipNode = query(`.${getNewTipId(name)}`)

  if (likeNumber(name) && !tipNode) {
    throw new Error(`[wintip]: name ${name} is not defined`)
  }

  return wintipFactory(`${name}`.trim(), tipNode, opts)
}

// sugas
winTip.info = (...args) => winTip.$({ level: 'info' }).apply(winTip, args)

winTip.warn = (...args) =>
  winTip.$({ color: WARN_COLOR, level: 'warn' }).apply(winTip, args)

winTip.error = (...args) =>
  winTip.$({ color: ERROR_COLOR, level: 'error' }).apply(winTip, args)

winTip.version = 'VERSION'

export default winTip
