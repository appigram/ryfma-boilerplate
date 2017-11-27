import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'
import PostTitle from './PostTitle'

const { Content, Extra, Description, Image } = Item

const PostsListItem = (props) => {
  const post = props.post

  return (
    <Item key={props.key} className='post-list-item'>
      <Content>
        <PostTitle
          id={post._id}
          userId={post.userId}
          username={post.author.username}
          name={post.author.profile.name}
          verified={post.author.emails[0].verified}
          title={post.title}
          slug={post.slug}
          created={post.createdAt}
          userAvatar={post.author.profile.image}
        />

        <Description>
          <div className='post-body' dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          {post.coverImg
            ? <LazyLoad height={150} offset={300} once>
              <Link to={`/p/${post._id}/${post.slug}`}>
                <Image size='small' src={post.coverImg.replace('_full_', '_thumb_')} alt={post.title} />
              </Link>
            </LazyLoad>
            : null
          }
        </Description>

        <Extra>
          <Link to={`/p/${post._id}/${post.slug}`}>{props.t('readMore')}</Link>
        </Extra>

      </Content>
    </Item>
  )
}

export default translate('post')(PostsListItem)
