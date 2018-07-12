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
} from './utils'

const BOX_CLASS_NAME = '_win_tip_box'
const TIP_CLASS_NAME = '_win_tip'
const TIP_ID_PREFIX = '_tip_'
const BOX_SLEEP = '_win_tip_box--sleep'
const WARN_COLOR = '#fee381'
const ERROR_COLOR = '#ff4545'
const WEAK_TIME = 30 * 1000

// start from 1
let tipNo: number = 1
let sleepTimer: number = 0
const log = console.log

type Output = 'ease-in' | 'ease-out' | 'ease-in-out' | true | false
type Tip = (...args: any[]) => Element | {}

// interface WintipFactory {
//   new (name: string): Widget
//   (width: number, height: number): Widget
// }

interface Options {
  output?: Output
  console?: boolean
  opacity?: number
  color?: string
  level?: string
}

interface NamedTip {
  (...args: any[]): Element | {}
  __name: string
}

interface SubOptions {
  level?: string
  color?: string
}

interface WinTip {
  (...args: any[]): Element | {}
  version: string
  config(options: Options): void
  info: Tip
  warn: Tip
  error: Tip
  remove(tip: Element | string | number): void
  $(options: SubOptions): (...args: any[]) => {} | null
}

let settings: Options = {
  // 'debug', 'info', 'warn', 'error'
  output: true,
  console: false,
  opacity: 0.75,
  color: '#fff'
}

function consoleProxy(isOpen: boolean) {
  const mlog = (...args: any[]) => {
    winTip.apply(winTip, args)
    log.apply(console, args)
  }

  console.log = isOpen ? mlog : log
}

function checkDisplayLevel(baseLevel = 'debug') {
  const ranking = ['debug', 'info', 'warn', 'error']
  const outputLevel =
    ranking.indexOf(`${settings.output}`) < 0
      ? ranking.length
      : ranking.indexOf(`${settings.output}`)

  return ranking.indexOf(baseLevel) >= outputLevel || settings.output === true
}

const winTip = <WinTip>function(...args: any[]) {
  const idStr = getNewTipId()
  const tipNode = query(`.${idStr}`)
  const isRender = checkDisplayLevel('debug') && args.length

  // return a empty object({}) when output is false
  // normaly return a Element object
  return isRender ? renderTip(tipNode, [idStr], joinWithSpace(args)) : {}
}

function getNewTipId(name?: string | number) {
  name = name === undefined ? tipNo++ : name

  return space2dash(TIP_ID_PREFIX + name)
}

function joinWithSpace(args: any[], prefix = '') {
  const res = args
    .map(e => (typeof e === 'object' ? stringify(e) : `${e}`))
    .join(' ')

  return prefix ? `[${prefix}] ${res}` : res
}

function createTipFragment(idArr: string[], msg: string, opts?: Options) {
  const fragment = document.createDocumentFragment()
  const tip = createEl('span')

  tip.className = [TIP_CLASS_NAME, ...idArr].join(' ')
  tip.textContent = msg

  append(fragment, tipDecorator(tip, opts))
  append(fragment, createEl('br'))

  return fragment
}

function createTipBox(fragment: DocumentFragment) {
  const box = createEl('div')

  box.className = BOX_CLASS_NAME
  box.style.color = settings.color || null
  box.onclick = () => weakUp(box)

  return append(box, fragment)
}

function weakUp(tipBox: Element) {
  clearTimeout(sleepTimer)
  tipBox.classList.remove(BOX_SLEEP)
  setTimeout(sleep, WEAK_TIME, tipBox)
}

function sleep(tipBox: Element) {
  tipBox.classList.add(BOX_SLEEP)
}

function tipDecorator(tipNode: HTMLElement, opts?: Options) {
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

function renderTip(
  tipNode: Element | null,
  idArr: string[],
  msg: string,
  opts?: Options
) {
  const tipBox = query(`.${BOX_CLASS_NAME}`)
  const tipFragment = createTipFragment(idArr, msg, opts)

  if (tipNode) {
    tipNode.textContent = msg
    return tipDecorator(<HTMLElement>tipNode, opts)
  }

  if (tipBox) {
    append(tipBox, tipFragment)

    // scroll to bottom
    tipBox.scrollTop = tipBox.scrollHeight
    weakUp(tipBox)
  } else {
    const box = createTipBox(tipFragment)
    append(document.body, box)
  }

  return query(`.${idArr.join(' .')}`)
}

function wintipFactory(name: string, tipNode: Element | null, opts: Options) {
  const tipFn = <NamedTip>function(...args: any[]) {
    const idArr = likeNumber(name)
      ? [getNewTipId()]
      : [getNewTipId(), getNewTipId(name)]
    const isRender = checkDisplayLevel(opts.level) && args.length

    return isRender
      ? renderTip(
          tipNode || query(`.${getNewTipId(name)}`),
          idArr,
          joinWithSpace(args, likeNumber(name) ? '' : name),
          opts
        )
      : null
  }

  tipFn['__name'] = name

  return tipFn
}

winTip.remove = (tip: Tip | Element | string | number) => {
  if (!tip) return
  let node: Element | null

  if (isElement(tip)) {
    node = tip
  } else if (isFunc(tip)) {
    node = query(`.${getNewTipId(tip.__name)}`)
  } else if (likeNumber(tip)) {
    node = querys(`.${TIP_CLASS_NAME}`)[tip]
  } else {
    node = query(`.${getNewTipId(tip)}`)
  }

  if (!node) return

  node.nextElementSibling && node.nextElementSibling.remove()
  node.remove()
}

winTip.config = (opts: Options): void => {
  settings = { ...settings, ...opts }

  // consoleProxy is 'debug' level
  consoleProxy(checkDisplayLevel('debug') && !!settings.console)
}

winTip.$ = (name: SubOptions | string | number, opts: Options = {}) => {
  if (name && typeof name === 'object') return wintipFactory('', null, name)

  const tipNode = query(`.${getNewTipId(name)}`)

  if (likeNumber(name) && !tipNode) {
    throw new Error(`[wintip]: name ${name} is not defined`)
  }

  return wintipFactory(`${name}`.trim(), tipNode, opts)
}

// sugas
winTip.info = (...args: any[]) =>
  winTip.$({ level: 'info' }).apply(winTip, args)

winTip.warn = (...args: any[]) =>
  winTip.$({ color: WARN_COLOR, level: 'warn' }).apply(winTip, args)

winTip.error = (...args: any[]) =>
  winTip.$({ color: ERROR_COLOR, level: 'error' }).apply(winTip, args)

winTip.version = 'VERSION'

export default winTip
