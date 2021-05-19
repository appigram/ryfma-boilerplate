import React from 'react'
import { useTranslation } from 'react-i18next'
import TimeAgo from 'react-timeago'
import russianStrings from 'react-timeago/lib/language-strings/ru'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import store from '/lib/store'

function TimeAgoExt ({ date }) {
  const [i18n] = useTranslation()
  let currLang = 'ru'
  if (i18n && i18n.language) {
    currLang = i18n.language
  } else if (store) {
    try {
      const storedLang = store.getItem('i18nextLng')
      if (storedLang) {
        currLang = storedLang
      }
    } catch(err) { }
  }
  const formatter = currLang === 'en' ? buildFormatter(englishStrings) : buildFormatter(russianStrings)
  return (
    <TimeAgo date={date} formatter={formatter} itemProp='datePublished' live={false} />
  )
}

export default TimeAgoExt
