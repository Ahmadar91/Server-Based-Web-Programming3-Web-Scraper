import request from 'request'
import cheerio from 'cheerio'
// import fetch from 'node-fetch'
// const fetch = require('node-fetch')
// const request = require('request')
// const cheerio = require('cheerio')

export function extractLinks (urls) {
  const url = urls + ''
  console.log(url)
  request(url, function (error, response, body) {
    console.log('error:', error) // Print the error if one occurred
    const $ = cheerio.load(body)
    const ol = $('a')
    ol.each(function (index, element) {
      console.log($(this).text())
      if ($(this).text() === 'Calendar') {
        console.log(element.attribs.href)
      }
    })
  })
}
