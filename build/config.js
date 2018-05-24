const paths = {
  src: 'src',
  dist: 'lib',
  global: 'wintip'
}

const bundles = [
  {
    entry: 'wintip.js',
    filename: 'wintip.esm.js',
    format: 'esm'
  },
  {
    entry: 'wintip.js',
    filename: 'wintip.js',
    format: 'umd'
  },
  {
    entry: 'wintip.js',
    filename: 'wintip.min.js',
    format: 'umd',
    minify: true
  }
]

module.exports = {
  bundles,
  paths
}
