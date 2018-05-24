const { rollup } = require('rollup')
const fs = require('fs-extra')
const chalk = require('chalk')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const postcss = require('rollup-plugin-postcss')
const babel = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const { uglify } = require('rollup-plugin-uglify')
const { paths, bundles } = require('./config')
const version = process.env.VERSION || process.env.npm_package_version
const project = process.env.npm_package_name
const { pubDate, handleRollupError, rootPath } = require('./utils')

const BANNER = `/*!
 * ${project} v${version}
 * (c) Vincent
 * Released under the MIT License.
 */`

function getOutputPath(name) {
  return rootPath(`${paths.dist}/${name}`)
}

function getInputPath(name) {
  return rootPath(`${paths.src}/${name}`)
}

// Errors in promises should be fatal.
let loggedErrors = new Set()
process.on('unhandledRejection', err => {
  if (loggedErrors.has(err)) {
    // No need to print it twice.
    process.exit(1)
  }
  throw err
})

async function createBundle(bundle) {
  const logKey =
    chalk.white.bold(bundle.filename) + chalk.dim(` (${bundle.format})`)
  const rollupConfig = {
    input: getInputPath(bundle.entry),
    plugins: [
      postcss(),
      resolve(),
      commonjs(),
      replace({
        VERSION: version
      }),
      babel(),
      bundle.minify &&
        uglify({
          output: {
            comments: /^!/
          }
        })
    ].filter(Boolean)
  }
  const rollupOutputOptions = {
    file: getOutputPath(bundle.filename),
    banner: BANNER,
    format: bundle.format,
    interop: false,
    exports: bundle.exports || 'auto',
    name: paths.global,
    sourcemap: false
  }

  console.log(chalk.bgYellow.black(' BUILDING '), logKey)
  try {
    const result = await rollup(rollupConfig)
    await result.write(rollupOutputOptions)
  } catch (error) {
    console.log(chalk.bgRed.black(' OH NOES! '), `${logKey}\n`)
    loggedErrors.add(error)
    handleRollupError(error)
    throw error
  }

  console.log(
    chalk.bgGreen.black(' COMPLETE '),
    `${chalk.white.bold(bundle.filename)}\n`
  )
}

function clean() {
  return fs.emptyDir(rootPath(paths.dist))
}

async function bundleAll() {
  for (const bundle of bundles) {
    await createBundle(bundle)
  }
}

function build() {
  return clean().then(bundleAll)
}

build()

module.exports = build
