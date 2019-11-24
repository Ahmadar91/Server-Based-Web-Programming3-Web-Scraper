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
//   const body = await getDataFromAPI(url)
//   const $ = cheerio.load(body)
//   //   console.log($.html())
//   const form = $('form')
//   const action = form.attr('action')
//   console.log('TCL: getDinnerHTML -> action', action)
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
  const friday = []
  const selector = $('.WordSection2>')
  selector.each(function (index, element) {
    console.log($(this).text().toLowerCase())
    friday.push($(this).text().toLowerCase())
  })
  console.log(friday)
}

async function login () {
  let responseHeaders = ''
  const options = {
    method: 'POST',
    uri: lastUrl + '/login',
    body: {
      username: 'zeke',
      password: 'coys',
      submit: 'login'
    },
    json: true
  }
  await request(options, (error, response) => {
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

// async function getDataFromAPI (url) {
//   const response = await fetch(url)
//   const body = await response.text()
//   //   console.log(body)
//   return body
// }
