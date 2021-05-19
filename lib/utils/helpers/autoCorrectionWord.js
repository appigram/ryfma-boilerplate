const autoCorrectionWord = (str) => {
  const s = [
    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'
  ]

  const r = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '\\[', '\\]',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'",
    'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '\\.'
  ]

  for (var i = 0; i < r.length; i++) {
    const reg = new RegExp(r[i], 'mig')
    str = str.replace(reg, (a) => {
      return a === a.toLowerCase() ? s[i] : s[i].toUpperCase()
    })
  }
  return str
}

export default autoCorrectionWord
