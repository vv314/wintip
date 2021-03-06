const paths = {
  src: 'src',
  dist: 'lib',
  global: 'wintip'
}

const bundles = [
  {
    entry: 'wintip.ts',
    filename: 'wintip.esm.js',
    format: 'esm'
  },
  {
    entry: 'wintip.ts',
    filename: 'wintip.js',
    format: 'umd'
  },
  {
    entry: 'wintip.ts',
    filename: 'wintip.min.js',
    format: 'umd',
    minify: true
  }
]

module.exports = {
  bundles,
  paths
}
