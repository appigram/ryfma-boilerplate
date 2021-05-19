import React from 'react'
import { Link } from 'react-router-dom'

const BackTo = ({ backToLink, backToText }) => (
  <Link to={backToLink} id='backto-left'>
    <div id='backto-bg'>
      <nobr id='backto-text'>
        <i aria-hidden='true' className='icon angle-left big' />
        {backToText}
      </nobr>
    </div>
  </Link>
)

export default BackTo
