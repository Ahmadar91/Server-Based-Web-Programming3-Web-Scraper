// import request from 'request'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import startReservation from './Reservations'
// const fetch = require('node-fetch')
// const request = require('request')
// const cheerio = require('cheerio')
let links = []
export default async function startCinema (arr, url) {
//   console.log(arr)
  links = url

  console.log('TCL: startCinema -> links', links)

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
        name: $(this).text().toLowerCase(),
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
//   console.log('TCL: getMovie -> arr', arr)
  const movies = []
  //   const movie2 = []
  //   const movie3 = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    // console.log('TCL: getMovie -> element', element)
    // console.log('TCL: getMovie -> element', element)

    // console.log('TCL: getMovie -> getDay', getDay)
    // console.log(222)
    for (let j = 0; j < day.length; j++) {
      const getDay = day[j].day
      //   console.log('TCL: getMovie -> getDay', getDay)
      if (element === getDay) {
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[0].value}`))
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[1].value}`))
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[2].value}`))
      }
    }
  }
  //   console.log(movies)
  //   console.log(movie2)
  //   console.log(movie3)
  //   console.log(movies[1][0])
  //   console.log(movies[1][1])
  //   console.log(movies[1][2])
  getResults(movies, day, movie)
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

function getResults (arr, day, movie) {
  const availableTimeResults = []

  //   console.log('TCL: getResults -> arr', arr)
  for (let index = 0; index < arr.length; index++) {
    for (let j = 0; j < 3; j++) {
      const movie = arr[index][j]
      if (movie.status === 1) {
        availableTimeResults.push(movie)
      }
    }
  }
  //   console.log(availableTimeResults)
  const finalResults = []

  for (let index = 0; index < availableTimeResults.length; index++) {
    const movieDetails = {}
    const element = availableTimeResults[index]
    movieDetails.movieTime = element.time
    for (let j = 0; j < day.length; j++) {
      if (element.day === day[j].value) {
        // console.log(day[j].day)
        movieDetails.day = day[j].day
      }
      if (element.movie === movie[j].value) {
        // console.log(movie[j].name)
        movieDetails.movieName = movie[j].name
      }
    }

    // console.log('TCL: getResults -> movieDetails', movieDetails)
    finalResults.push(movieDetails)
  }
  //   console.log(finalResults)
  startReservation(finalResults, links[2])
//   console.log('TCL: getResults -> links[2]', links[2])
}
