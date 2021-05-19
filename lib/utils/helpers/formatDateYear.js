const MONTHS = {
  'ru': [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'фвгуста',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ],
  'en': [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]
}

const formatDateYear = (parseDate, lang) => {
  const date = new Date(parseDate)
  let month = date.getMonth()
  let day = date.getDate()
  day = day < 10 ? 0 + day.toString() : day
  return `${day} ${MONTHS[lang][month]} ${date.getFullYear()}`
}

export default formatDateYear
