import request from 'request'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
// const fetch = require('node-fetch')
// const request = require('request')
// const cheerio = require('cheerio')

export function extractLinks (urls) {
  const url = urls + ''
  // console.log(url)
  const items = []
  request(url, function (error, response, body) {
    if (error !== null) {
      console.log('error:', error)
    }
    const $ = cheerio.load(body)
    const ol = $('a')
    ol.each(function (index, element) {
      // console.log($(this).text())
      if ($(this).text() === 'Calendar') {
        items.push(element.attribs.href)
        getCalender(items[0])
        // console.log(element.attribs.href)
      }
    })
  })
}

function getCalender (urls) {
  const url = urls + ''
  console.log(url)

  fetch(url)
    .then(res => res.text())
    .then(function (body) {
      const $ = cheerio.load(body)
      console.log($('ul').html())
      const ul = $('a')
      const items = []
      ul.each(function (index, element) {
        // console.log($(this).text())
        items.push(element.attribs.href)
      })
      getDays(items, url)
    })
}

function getDays (arr, url) {
  const days = []
  let userData
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    fetch(url + element)
      .then(res => res.text())
      .then(body => {
        // console.log(body)
        const $ = cheerio.load(body)
        const tbody = $('tbody tr')
        const user = element.slice(0, element.length - 5)
        const availabeDay = tbody.text().trim()
        userData = {
          name: user,
          day: availabeDay
        }
        console.log(userData)

        days.push(userData)
        console.log(days)
      })
  }
}
