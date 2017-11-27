import React from 'react'
import { translate } from 'react-i18next'
import LazyLoad from 'react-lazyload'
import TimeAgoExt from '../Common/TimeAgoExt'
import { Link } from 'react-router-dom'
import { Header, Image, Icon } from 'semantic-ui-react'

const PostTitle = ({ id, userId, username, name, userAvatar, verified, title, slug, created, roles, t }) => {
  let avatar = userAvatar || null
  if (userAvatar.indexOf('_full_') > 0) {
    avatar = userAvatar.replace('_full_', '_middle_')
  } else if (userAvatar.indexOf('graph.facebook.com') > 0) {
    avatar = userAvatar.replace('=large', '=square')
  }
  let userBadge = null

  return (
    <div className='post-title'>
      <Link rel='author' to={`/u/${username}`}>
        <LazyLoad height={60} offset={300} once placeholder={<div className='ui avatar image img-placeholder' />}>
          <Image size='tiny' avatar src={avatar} alt={name} />
        </LazyLoad>
        {userBadge}
      </Link>
      <div className='post-title-info'>
        <div className='post-title-header'>
          <Header as='h3' itemProp='name'>
            <Link itemProp='url' rel='bookmark' to={`/p/${id}/${slug}`}>{title}</Link>
          </Header>
        </div>
        <div className='post-title-bottom'>
          {t('common:by')} <Link rel='author' to={`/u/${username}`}>{name}</Link>
          <span className='dot-divider'>·</span>
          <span className='post-date'>
            <TimeAgoExt date={created} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default translate()(PostTitle)
