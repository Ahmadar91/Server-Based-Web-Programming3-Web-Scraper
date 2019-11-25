import cheerio from 'cheerio'
import fetch from 'node-fetch'
import startReservation from './Reservations'

let links = []
export default async function startCinema (arr, url) {
  links = url
  const cinemaUrl = url[1] + ''
  const movieDayObjet = []
  const body = await getDataFromAPI(cinemaUrl)
  const $ = cheerio.load(body)
  const days = $('#day option')
  days.each(function (index, element) {
    if (!$(this).text().toLowerCase().includes('--- pick a day ---')) {
      movieDayObjet.push({
        day: $(this).text().toLowerCase(),
        value: element.attribs.value
      })
    }
  })
  const movieDetailObjet = []
  const movies = $('#movie option')
  movies.each(function (index, element) {
    if (!$(this).text().toLowerCase().includes('--- pick a movie ---')) {
      movieDetailObjet.push({
        name: $(this).text(),
        value: element.attribs.value
      })
    }
  })
  getMovie(movieDayObjet, movieDetailObjet, url[1], arr)
}
async function getMovie (day, movie, url, arr) {
  const movies = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    for (let j = 0; j < day.length; j++) {
      const getDay = day[j].day
      if (element === getDay) {
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[0].value}`))
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[1].value}`))
        movies.push(await getResponseFromAPI(url + `/check?day=${day[j].value}&movie=${movie[2].value}`))
      }
    }
  }
  getResults(movies, day, movie)
}
async function getDataFromAPI (url) {
  const response = await fetch(url)
  const body = await response.text()
  return body
}
async function getResponseFromAPI (url) {
  const response = await fetch(url)
  const body = await response.json()
  return body
}
function getResults (arr, day, movie) {
  const availableTimeResults = []
  for (let index = 0; index < arr.length; index++) {
    for (let j = 0; j < 3; j++) {
      const movie = arr[index][j]
      if (movie.status === 1) {
        availableTimeResults.push(movie)
      }
    }
  }
  const finalResults = []
  for (let index = 0; index < availableTimeResults.length; index++) {
    const movieDetails = {}
    const element = availableTimeResults[index]
    movieDetails.movieTime = element.time
    for (let j = 0; j < day.length; j++) {
      if (element.day === day[j].value) {
        movieDetails.day = day[j].day
      }
      if (element.movie === movie[j].value) {
        movieDetails.movieName = movie[j].name
      }
    }
    finalResults.push(movieDetails)
  }
  console.log('Scraping showTimes...OK')
  startReservation(finalResults, links[2])
}
