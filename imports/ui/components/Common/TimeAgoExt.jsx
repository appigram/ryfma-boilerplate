import React from 'react'
import TimeAgo from 'react-timeago'
import russianStrings from 'react-timeago/lib/language-strings/ru'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import store from '/lib/store'

const TimeAgoExt = (props) => {
  const { date } = props
  const currLang = typeof window !== 'undefined' ? store.getItem('i18nextLng') : 'ru'
  const formatter = currLang === 'ru' ? buildFormatter(russianStrings) : buildFormatter(englishStrings)
  return (
    <TimeAgo date={date} formatter={formatter} itemProp={props.isComment ? 'commentTime' : 'datePublished'} />
  )
}

export default TimeAgoExt
