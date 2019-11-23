// import request from 'request'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
// const fetch = require('node-fetch')
// const request = require('request')
// const cheerio = require('cheerio')

export async function extractLinks (urls) {
  const url = urls + ''
  console.log(url)
  const items = []
  const body = await getDataFromAPI(url)
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
}

async function getCalender (url) {
  const body = await getDataFromAPI(url)
  const $ = cheerio.load(body)
  console.log($('ul').html())
  const ul = $('a')
  const items = []
  ul.each(function (index, element) {
    // console.log($(this).text())
    items.push(element.attribs.href)
  })
  getDays(items, url)
}

async function getDays (arr, url) {
  const paulDays = []
  // let userData
  // for (let index = 0; index < arr.length; index++) {
  const element = arr[0]
  const body = await getDataFromAPI(url + element)
  // console.log(body)
  const $ = cheerio.load(body)
  const tbody = $('tbody tr')
  console.log(tbody.html())

  tbody.each(function (index, element) {
    const okDay = $(this).text().toLowerCase()
    console.log(okDay)

    paulDays.push(okDay)
  })
  console.log(paulDays)

  const user = element.slice(0, element.length - 5)
  console.log(user)

  const availableDay = tbody.html()
  console.log(availableDay.includes('ok'))

  // userData = {
  //   name: user,
  //   day: availableDay
  // }
  // console.log(userData)

  // console.log(days)
  // }
}

// async function getCalender (urls) {
//   const url = urls + ''
//   const body = await getDataFromAPI(url)
//   // console.log(body)

//   // console.log(url)
//   const $ = cheerio.load(body)
//   console.log($('ul').html())
// }

async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  // console.log(body)
  return body
}
/*
async function getCalender (urls) {
  const url = urls + ''
  // const body =
  // console.log(body)

  // console.log(url)
  const $ = await getDataFromAPI(url)
  console.log($('ul').html())
}

async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  // console.log(body)
  return cheerio.load(body)
}

 */
