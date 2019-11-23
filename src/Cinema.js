// import request from 'request'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
// const fetch = require('node-fetch')
// const request = require('request')
// const cheerio = require('cheerio')

export default async function startCinema (arr, url) {
  console.log(arr)

  console.log(url[1])
  console.log(arr)
  const cinemaUrl = url[1] + ''
  //   const movieDay = []
  //   const movieOption = []
  const movieDayObjet = []
  const body = await getDataFromAPI(cinemaUrl)
  const $ = cheerio.load(body)
  console.log($('#day').html())
  const days = $('#day option')
  days.each(function (index, element) {
    if (!$(this).text().toLowerCase().includes('--- pick a day ---')) {
    //   movieDay.push($(this).text().toLowerCase())
    //   movieOption.push(element.attribs.value)
      movieDayObjet.push({
        day: $(this).text().toLowerCase(),
        value: element.attribs.value
      })
    }
  })
  console.log(movieDayObjet)
  console.log(movieDayObjet[0])
  const movieDetailObjet = []
  const movies = $('#movie option')
  movies.each(function (index, element) {
    if (!$(this).text().toLowerCase().includes('--- pick a movie ---')) {
    //   movieDay.push($(this).text().toLowerCase())
    //   movieOption.push(element.attribs.value)
      movieDetailObjet.push({
        day: $(this).text().toLowerCase(),
        value: element.attribs.value
      })
    }
  })
  console.log(movieDetailObjet)
  console.log(url[1])
  console.log(movieDayObjet[0].day)

  getMovie(movieDayObjet, movieDetailObjet, url[1], arr)
  //   console.log(movieDay)
  //   console.log(movieOption)
  // }
}
async function getMovie (day, movie, url, arr) {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    console.log('TCL: getMovie -> element', element)
    // console.log('TCL: getMovie -> element', element)

    // console.log('TCL: getMovie -> getDay', getDay)
    console.log(222)
    for (let j = 0; j < day.length; j++) {
      const getDay = day[j].day
      console.log('TCL: getMovie -> getDay', getDay)
      if (element === getDay) {
        const movie1 = await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[0].value}`)
        const movie2 = await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[1].value}`)
        const movie3 = await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[2].value}`)
        console.log(movie1)
        console.log(movie2)
        console.log(movie3)
      }
    }
  }
}
async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  //   console.log(body)
  return body
}

async function getResponseFromAPI (url) {
  const response = await fetch(url)
  const body = await response.json()
  //   console.log(body)
  return body
}
