import fetch from 'node-fetch'
import cheerio from 'cheerio'
import request from 'request-promise-native'

let finalResults = []
let lastUrl

export default async function startReservation (results, url) {
  finalResults = results
  lastUrl = url
  getDinnerHTML(lastUrl)
}

async function getDinnerHTML (url) {
  const data = await login()
  const currentSession = data['set-cookie'].toString()

  const response = await fetch(lastUrl + '/' + data.location, {
    headers: {
      cookie: currentSession
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
  getRecommendations(dayValues)
}
function getRecommendations (values) {
  console.log('Recommendation')
  console.log('===============')
  for (let index = 0; index < finalResults.length; index++) {
    const element = finalResults[index]
    for (let j = 0; j < values.length; j++) {
      const element2 = values[j]
      if (element.day.includes(element2.slice(0, 3))) {
        if (parseInt(element.movieTime.slice(0, 2)) < parseInt(element2.slice(3, element2.length - 2))) {
          console.log('on ' + element.day + ' "' + element.movieName + '"' + ' starts at ' + element.movieTime + ' and there is a free table between ' + element2.slice(3, element2.length - 2) + ':00-' + element2.slice(5, element2.length) + ':00')
        }
      }
    }
  }
}
async function login () {
  let responseHeaders = ''
  await request({
    method: 'POST',
    uri: lastUrl + '/login',
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
    if (err === null) {
      console.log(err)
    }
  })

  return responseHeaders
}
