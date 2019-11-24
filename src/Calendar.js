// import request from 'request'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import startCinema from './Cinema.js'
const links = []
export async function startScraping (urls) {
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

async function getCalender (url) {
  console.log('Scraping links...OK')
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
    if (user.toLowerCase().includes('paul')) {
      tbody.each(function (index, element) {
        const okDay = $(this).text().toLowerCase()
        paulDays.push(okDay)
      })
    }
    if (user.toLowerCase().includes('peter')) {
      tbody.each(function (index, element) {
        const okDay = $(this).text().toLowerCase()
        peterDays.push(okDay)
      })
    }
    if (user.toLowerCase().includes('mary')) {
      tbody.each(function (index, element) {
        const okDay = $(this).text().toLowerCase()
        maryDays.push(okDay)
      })
    }
  }

  compareAvailableDays(paulDays, peterDays, maryDays)
}
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
  console.log('Scraping available days...OK')

  startCinema(confirmedDays, links)
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
