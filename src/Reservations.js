
const request = require('request-promise-native')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

let finalResults = []
let lastUrl
/**
 *
 * start the reservations
 * @export
 * @param {*} results
 * @param {*} url
 */
async function startReservation (results, url) {
  finalResults = results
  lastUrl = url
  getDinnerHTML(lastUrl)
}
/**
 *
 * get the headers from the POST response and do a GET for the with the new url and cookie
 * and add the input values to an array
 * @param {*} url
 */
async function getDinnerHTML (url) {
  const data = await loginToForm()
  const response = await fetch(`${url}/${data.location}`, {
    headers: {
      cookie: data['set-cookie'].toString()
    }
  })
  const results = await response.text()
  const $ = cheerio.load(results)
  const dayValues = []
  for (let index = 0; index < 3; index++) {
    const input = $(`.WordSection${(index + 1) * 2} input`)
    input.each(function (index, element) {
      dayValues.push((element.attribs.value))
    })
  }
  console.log('Scraping possible reservations...OK')
  getRecommendations(dayValues)
}
/**
 *
 * compare the results and display the available options
 * @param {*} values
 */
function getRecommendations (values) {
  console.log()
  console.log()
  console.log('Recommendations')
  console.log('===============')
  for (let index = 0; index < finalResults.length; index++) {
    const element = finalResults[index]
    for (let j = 0; j < values.length; j++) {
      const element2 = values[j]
      if (element.day.includes(element2.slice(0, 3))) {
        if (parseInt(element.movieTime.slice(0, 2)) < parseInt(element2.slice(3, element2.length - 2))) {
          console.log('* On ' + element.day.charAt(0).toUpperCase() + element.day.substring(1) + ' the movie "' + element.movieName + '"' + ' starts at ' + element.movieTime + ' and there is a free table between ' + element2.slice(3, element2.length - 2) + ':00-' + element2.slice(5, element2.length) + ':00')
        }
      }
    }
  }
}
/**
 *POST request with the form and the login url which returns the response headers
 *
 * @returns
 */
async function loginToForm () {
  let responseHeaders = ''
  await request({
    method: 'POST',
    followAllRedirects: false,
    followOriginalHttpMethod: false,
    uri: `${lastUrl}/login`,
    body: {
      username: 'zeke',
      password: 'coys',
      submit: 'login'
    },
    json: true
  }, (error, response) => {
    if (error) {
      console.log(error)
    }
    responseHeaders = response.headers
  }).catch((err) => {
    if (err.statusCode !== 302) {
      console.log(err)
    }
  })
  return responseHeaders
}
module.exports = startReservation
