const formatDate = (date) => {
  let month = date.getMonth() + 1
  month = month < 10 ? 0 + month.toString() : month
  let day = date.getDate()
  day = day < 10 ? 0 + day.toString() : day
  let hours = date.getHours()
  hours = hours < 10 ? 0 + hours.toString() : hours
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? 0 + minutes.toString() : minutes
  let strTime = hours + ':' + minutes
  return `${date.getFullYear()}-${month}-${day}T${strTime}+00:00`
}

export default formatDate
