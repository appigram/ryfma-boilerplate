import React from 'react'
import { Icon } from 'semantic-ui-react'

const EmptyBlock = ({ iconName, header, text }) => {
  return (
    <div className='empty-block'>
      <Icon name={iconName} />
      <h3>{header}</h3>
      <p>{text}</p>
    </div>
  )
}

export default EmptyBlock
