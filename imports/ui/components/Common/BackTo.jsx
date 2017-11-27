import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

const BackTo = ({ backToLink, backToText }) => (
  <Link to={backToLink} id='backto-left'>
    <div id='backto-bg'>
      <nobr id='backto-text'>
        <Icon name='angle left' size='big' />
        {backToText}
      </nobr>
    </div>
  </Link>
)

export default BackTo
