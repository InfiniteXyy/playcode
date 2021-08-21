const ghPages = require('gh-pages')

ghPages.publish('dist', {}, () => {
  console.log('published to github pages')
})
