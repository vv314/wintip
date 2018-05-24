const bs = require('browser-sync').create()
const build = require('./scripts.js')

bs.init({
  server: {
    baseDir: ['./', 'lib'],
    https: false,
    index: 'demo.html'
  }
})

bs.watch('./*.html').on('change', bs.reload)

bs.watch('src/**/*.js').on('change', file => {
  build().then(bs.reload)
})

bs.watch('src/**/*.css').on('change', file => {
  build().then(bs.reload)
})
