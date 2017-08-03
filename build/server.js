const bs = require('browser-sync').create()
const buildScript = require('./scripts.js')

bs.init({
  server: {
    baseDir: ['./', 'dist'],
    https: false,
    index: 'demo.html'
  }
})

bs.watch('./*.html').on('change', bs.reload)

bs.watch('src/**/*.js').on('change', file => {
  buildScript().then(bs.reload)
})

