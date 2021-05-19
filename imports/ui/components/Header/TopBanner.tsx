import React from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useSettings } from '/imports/hooks'

function TopBanner() {
  const { setReadAnounce } = useSettings()

  const hideAnouncement = () => {
    setReadAnounce(3)
    Cookies.set('readAnounce', 3, { expires: 7 })
  }

  return (<aside className='announcement-banner'>
    <div className='banner-content'>
      <Link to='/coronavirus?refUsername=polina' className='new-badge'>Возврату не подлежит</Link>
      <strong></strong>
      🦠120 топовых поэтов! Книга, отразившая реальность 2020 года.🦠
      <Link to='/coronavirus?refUsername=polina'>Узнать&nbsp;больше</Link>
    </div>
    <button className='banner-close-button' type='button' onClick={hideAnouncement}>
      <svg className='icon times' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'>
        <title>Close</title>
        <path d='M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z' />
      </svg>
    </button>
  </aside>)
}

export default TopBanner
