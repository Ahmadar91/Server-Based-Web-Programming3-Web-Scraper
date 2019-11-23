import fetch from 'node-fetch'
import cheerio from 'cheerio'

let finalResults = []
let lastUrl
export default async function startReservation (results, url) {
  finalResults = results
  console.log('reservation', finalResults)
  lastUrl = url
  console.log(lastUrl)
  getDinnerHTML(lastUrl)
}

async function getDinnerHTML (url) {
  const body = await getDataFromAPI(url)
  const $ = cheerio.load(body)
  console.log($.html())
}

async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  //   console.log(body)
  return body
}
