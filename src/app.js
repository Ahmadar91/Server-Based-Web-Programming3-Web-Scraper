import request from 'request'
import cheerio from 'cheerio'
// const request = require('request')
// const cheerio = require('cheerio')
console.log('srape')

request('http://vhost3.lnu.se:20080/weekend', function (error, response, body) {
  console.log('error:', error) // Print the error if one occurred

  const page = cheerio.load(body)
  const ol = page('a')
  ol.each(function (index, element) {
    console.log(page(this).text())
    if (page(this).text() === 'Calendar') {
      console.log(element.attribs.href)
    }
  })
})
