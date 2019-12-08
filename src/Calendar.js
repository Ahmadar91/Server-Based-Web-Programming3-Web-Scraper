
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const startCinema = require('./Cinema.js')
const links = []
/**
 *start the scraping process and extract links
 *
 * @export
 * @param {*} urls
 */
async function startScraping (urls) {
  const url = urls + ''
  const body = await getDataFromAPI(url)
  const $ = cheerio.load(body)
  const ol = $('a')
  ol.each(function (index, element) {
    links.push(element.attribs.href)
  })
  console.log('Scraping links...OK')
  getCalender(links[0])
}
/**
 *extract the the href and the name of users
 *
 * @param {*} url
 */
async function getCalender (url) {
  const body = await getDataFromAPI(url)
  const $ = cheerio.load(body)
  const ul = $('a')
  const items = []
  const userName = []
  ul.each(function (index, element) {
    items.push(element.attribs.href)
    userName.push($(this).text())
  })

  getDays(items, url, userName)
}
/**
 *get the the days for the users
 *
 * @param {*} arr
 * @param {*} url
 * @param {*} userName
 */
async function getDays (arr, url, userName) {
  const paulDays = []
  const peterDays = []
  const maryDays = []
  for (let index = 0; index < arr.length; index++) {
    const userText = arr[index]
    const body = await getDataFromAPI(url + userText)
    const $ = cheerio.load(body)
    const tbody = $('tbody tr td')
    const user = userName[index]
    tbody.each(function () {
      if (user.toLowerCase().includes('paul')) {
        const okDay = $(this).text().toLowerCase()
        paulDays.push(okDay)
      }
      if (user.toLowerCase().includes('peter')) {
        const okDay = $(this).text().toLowerCase()
        peterDays.push(okDay)
      }
      if (user.toLowerCase().includes('mary')) {
        const okDay = $(this).text().toLowerCase()
        maryDays.push(okDay)
      }
    })
  }
  compareAvailableDays(paulDays, peterDays, maryDays)
}
/**
 *
 * check the days for the users if all three are ok then add the day to the array
 * @param {*} paul
 * @param {*} peter
 * @param {*} mary
 */
function compareAvailableDays (paul, peter, mary) {
  const confirmedDays = []
  for (let index = 0; index < 3; index++) {
    const paulOkDays = paul[index]
    const peterOkDays = peter[index]
    const maryOkDays = mary[index]
    if (paulOkDays === peterOkDays && paulOkDays === maryOkDays && peterOkDays === maryOkDays) {
      if (index === 0) {
        confirmedDays.push('friday')
      }
      if (index === 1) {
        confirmedDays.push('saturday')
      }
      if (index === 2) {
        confirmedDays.push('sunday')
      }
    }
  }
  if (confirmedDays.length !== 0) {
    console.log('Scraping available days...OK')
    startCinema(confirmedDays, links)
  } else {
    console.log('No available days')
  }
}
/**
 *
 * return the body of the html for the url
 * @param {*} url
 * @returns
 */
async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  return body
}
module.exports = startScraping
