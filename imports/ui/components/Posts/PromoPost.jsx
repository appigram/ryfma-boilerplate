import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'

const PromoPost = () => {
  return (
    <Item.Group relaxed className='promo-post'>
      <Item className='user-info'>
        <Link className='user-info-link' to={`/u/#`}>
          <Item.Image avatar size='tiny' src={'userAvatar'} />
        </Link>
        <Item.Content verticalAlign='middle'>
          <div className='user-info-content'>
            <Item.Header>
              <Link to={`/u/#`}>Username</Link>
            </Item.Header>
            <Item.Description>
              User info
            </Item.Description>
          </div>
          <div className='actions-block'>
            <Link
              to='#'
              className='link-promo-view'
            >
              View
            </Link>
            <Link
              to='/promo'
              className='link-promo-about'
            >
              Ads on MO.ST
            </Link>
          </div>
        </Item.Content>
      </Item>
    </Item.Group>
  )
}

export default PromoPost
