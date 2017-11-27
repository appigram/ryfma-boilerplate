import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Header, Icon } from 'semantic-ui-react'

const { Image } = Item

const Stories = () => {
  return (<div className='stories'>
    <Header as='h3'>Stories</Header>
    <Link to='#' className='add-story'>
      <Icon color='blue' name='add circle' size='huge' />
      <div>Add story</div>
    </Link>
    <Link to='/' className='story'>
      <Image size='tiny' avatar src='https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg' />
      <div>Username</div>
    </Link>
    <Link to='/' className='story'>
      <Image size='tiny' avatar src='https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg' />
      <div>Username</div>
    </Link>
  </div>
  )
}

export default Stories
