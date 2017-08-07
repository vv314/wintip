const gzipSize = require('gzip-size')
const path = require('path')
const promisify = require('util.promisify')
const chalk = require('chalk')
const fs = require('fs')

function write(dest, code, msg = '') {
  const writeFile = promisify(fs.writeFile)
  return writeFile(dest, code)
    .then(() => {
      console.log(chalk.blueBright(path.relative(process.cwd(), dest)), msg)
    })
    .catch(error => {
      console.log(error)
    })
}

function isProd() {
  return process.env.NODE_ENV === 'prod'
}

function getSize(code, showGzip = false) {
  const format = size => (size / 1024).toFixed(2)
  const len = typeof code === 'number' ? code : code.length
  const gzip = gzipSize.sync(code)
  return chalk.greenBright(
    `[${format(len)}kb${showGzip ? `, gzip ${format(gzip)}kb]` : ']'}`
  )
}

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

function pubDate(dt) {
  const date = parseDate(dt)
  return `${date.y}-${date.M}-${date.d}`
}

function baseName(filePath) {
  return path.basename(filePath)
}

module.exports = {
  write,
  isProd,
  pubDate,
  baseName,
  getSize
}
