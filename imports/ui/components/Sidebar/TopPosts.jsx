import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Item, Card } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import LazyLoad from 'react-lazyload'
import gql from 'graphql-tag'

const { Content, Group, Header, Image, Meta } = Item

const TopPostsComponent = ({ data, t }) => {
  if (data.loading) {
    return <div />
  }

  if (data.error) {
    return <div>Error: { data.error.message }</div>
  }

  return (
    <Card className='sidebar-card'>
      <Card.Content>
        <Card.Header>
          {t('common:sidebar.topPosts')}
        </Card.Header>
      </Card.Content>
      <Card.Content className='body'>
        <Group>
          {data.topPosts.map((post) => {
            const postImage = post.coverImg ? post.coverImg.replace('_full_', '_thumb_') : 'https://cdnryfma.s3.amazonaws.com/defaults/icons/default_middle_avatar.jpg'

            return (<Item itemScope itemType='http://schema.org/Article'>
              <Link itemProp='url' rel='bookmark' to={`/p/${post._id}/${post.slug}`}>
                <LazyLoad height={48} once placeholder={<div className='ui tiny avatar image img-placeholder' />}>
                  <Image itemProp='image' size='tiny' avatar src={postImage} alt={post.title} />
                </LazyLoad>
              </Link>
              <Content>
                <Header><Link itemProp='name' rel='bookmark' to={`/p/${post._id}/${post.slug}`}>{post.title}</Link></Header>
                <Meta>
                  <Link rel='author' to={`/u/${post.author.username}`}>{post.author.profile.name}</Link>
                </Meta>
              </Content>
            </Item>)
          }
          )}
        </Group>
      </Card.Content>
    </Card>
  )
}

const getTopPosts = gql`
  query getTopPosts {
    topPosts {
      _id
      title
      slug
      userId
      coverImg
      author {
        username
        profile {
          name
        }
      }
    }
  }
`

const TopPosts = graphql(getTopPosts)(TopPostsComponent)

export default translate()(TopPosts)
