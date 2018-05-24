const fs = require('fs')
const path = require('path')
const uglify = require('uglify-js')
const codeFrame = require('babel-code-frame')

const appDirectory = fs.realpathSync(process.cwd())

function rootPath(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

/**
 * 解析日期
 * @param  {Date | Number} target 日期对象或时间戳
 * @return {Object}        结果对象
 */
function parseDate(target) {
  const f = n => (n > 9 ? n : '0' + n)
  const date = target instanceof Date ? target : new Date(target)
  return {
    y: date.getFullYear(),
    M: f(date.getMonth() + 1),
    d: f(date.getDate()),
    h: f(date.getHours()),
    m: f(date.getMinutes()),
    s: f(date.getSeconds())
  }
}

/**
 * 格式化日期为 yyyy-MM-dd 格式
 * @param  {Date | Number} dt 日期对象或时间戳
 * @return {String}    格式化结果
 */
function pubDate(dt) {
  const date = parseDate(dt)
  return `${date.y}-${date.M}-${date.d}`
}

function handleRollupError(error) {
  if (!error.code) return console.error(error)

  console.error(
    `\x1b[31m-- ${error.code}${error.plugin ? ` (${error.plugin})` : ''} --`
  )
  console.error(error.message)
  const { file, line, column } = error.loc

  if (file) {
    // This looks like an error from Rollup, e.g. missing export.
    // We'll use the accurate line numbers provided by Rollup but
    // use Babel code frame because it looks nicer.
    const rawLines = fs.readFileSync(file, 'utf-8')
    // column + 1 is required due to rollup counting column start position from 0
    // whereas babel-code-frame counts from 1
    const frame = codeFrame(rawLines, line, column + 1, {
      highlightCode: true
    })
    console.error(frame)
  } else {
    // This looks like an error from a plugin (e.g. Babel).
    // In this case we'll resort to displaying the provided code frame
    // because we can't be sure the reported location is accurate.
    console.error(error.codeFrame)
  }
}

function nodeModulesRegExp(modules = []) {
  if (!Array.isArray(modules)) {
    modules = [modules]
  }
  // path.sep 指定平台特定的分隔符
  // Windows: \   POSIX: /
  // 参考：http://nodejs.cn/api/path.html#path_path_sep
  return modules.map(mod => new RegExp(`node_modules\\${path.sep}${mod}?`))
}

function minify(code) {
  return uglify.minify(code, {
    output: {
      comments: /^!/
    },
    toplevel: true
  }).code
}

module.exports = {
  parseDate,
  pubDate,
  handleRollupError,
  rootPath,
  nodeModulesRegExp,
  minify
}
