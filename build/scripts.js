const shell = require('shelljs')
const rollup = require('rollup')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-re')
const uglify = require('uglify-js')
const version = process.env.VERSION || process.env.npm_package_version
const project = process.env.npm_package_name
const { write, isProd, baseName, getSize } = require('./utils')
const CONF = require('./config')

shell.mkdir('-p', 'dist/')

const banner = `/*!
 * ${project} v${version}
 * (c) Vincent
 * Released under the MIT License.
 */`

let cache
const rollupConf = {
  entry: CONF.entry,
  format: 'umd',
  dest: CONF.dest, // equivalent to --output
  cache: cache,
  moduleName: CONF.name,
  sourceMap: true,
  banner,
  plugins: [
    node(),
    cjs(),
    replace({
      patterns: [
        {
          test: '__RUNTIME__',
          replace: process.env.API === 'prod' ? '' : '_TEST'
        }
      ]
    }),
    buble()
  ]
}

async function build(cb) {
  const mapPath = `\n//# sourceMappingURL=${baseName(CONF.dest)}.map`

  try {
    const { code, map } = await rollup
      .rollup(rollupConf)
      .then(bundle => bundle.generate(rollupConf))

    await Promise.all([
      write(CONF.dest, code + mapPath, getSize(code)),
      write(`${CONF.dest}.map`, map.toString())
    ])

    if (isProd()) {
      const miniCode = minify(code)
      write(CONF.prod, miniCode, getSize(miniCode, true))
    }
  } catch (err) {
    console.log(err)
  }

  return CONF.dest
}

function minify(code) {
  return uglify.minify(code, {
    output: {
      comments: /^!/
    },
    toplevel: true
  }).code
}

build()

module.exports = build
