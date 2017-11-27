import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Item, Header } from 'semantic-ui-react'
import TimeAgoExt from '../Common/TimeAgoExt'

const { Content } = Item

const PostsListItemShort = (props) => {
  const post = props.post

  return (
    <Item key={props.key} className='post-list-item short-item' itemScope itemType='http://schema.org/Article'>
      <Content>
        <div className='post-title'>
          <div className='post-title-info'>
            <div className='post-title-header'>
              <Header as='h3' itemProp='name'>
                <Link itemProp='url' rel='bookmark' to={`/p/${post._id}/${post.slug}`}>{post.title}</Link>
              </Header>
              <span className='post-date'>
                <TimeAgoExt date={post.createdAt} />
              </span>
            </div>
          </div>
        </div>

      </Content>
    </Item>
  )
}

export default translate()(PostsListItemShort)
