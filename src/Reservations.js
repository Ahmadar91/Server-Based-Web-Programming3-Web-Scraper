import fetch from 'node-fetch'
import cheerio from 'cheerio'
import request from 'request-promise-native'

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
  const data = await login()
  const currentSession = data['set-cookie'].toString()

  const response = await fetch(lastUrl + '/' + data.location, {
    headers: {
      cookie: currentSession
    }
  })
  const results = await response.text()
  console.log(results)
  const $ = cheerio.load(results)
  console.log($.html())
  //   const form = $('form')
  const dayValues = []
  for (let index = 0; index < 3; index++) {
    const input = $(`.WordSection${(index + 1) * 2} input`)
    input.each(function (index, element) {
      dayValues.push((element.attribs.value))
    })
  }
  getResults(dayValues)
}
function getResults (values) {
  console.log(values)
  console.log(finalResults)
  console.log('Recommendation')
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

//   const userName = {
//     username: 'zeke',
//     password: 'coys',
//     submit: 'login'
//   }
//   console.log(action)
//   const response = await fetch(lastUrl + '/login', {
//     method: 'POST',
//     body: JSON.stringify(userName),
//     headers: { 'Content-Type': 'application/json' }
//   })
//   const results = await response.text()
//   console.log(results)
}
