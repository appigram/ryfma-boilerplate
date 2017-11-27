import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import { Item, Card } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const { Content, Group } = Item

const RelatedPostsComponent = ({ data, type, t }) => {
  if (data.loading) {
    return <div />
  }

  if (data.error) {
    return <div>Error: { data.error.message }</div>
  }

  const relatedPosts = data.relatedPosts

  if (relatedPosts.lenght === 0) {
    return null
  }

  const relatedClassName = type === 'horizontal' ? 'recommended horizontal related-posts' : 'recommended vertical related-posts'

  return (
    <Card className={relatedClassName}>
      <Card.Content>
        <Card.Header>
          {t('relatedPosts')}
        </Card.Header>
      </Card.Content>
      <Card.Content className='body'>
        <Group>
          {relatedPosts.map((post) =>
            <Item>
              <Link to={`/p/${post._id}/${post.slug}`}>
                <LazyLoad height={150} offset={200} once placeholder={<div className='ui image img-placeholder' />}>
                  <img src={post.coverImg ? post.coverImg.replace('_full_', '_thumb_') : 'https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg'} />
                </LazyLoad>
              </Link>
              <Content>
                <Link to={`/p/${post._id}/${post.slug}`}>
                  <h3>{post.title}</h3>
                </Link>
              </Content>
            </Item>
          )}
        </Group>
      </Card.Content>
    </Card>
  )
}

const getRelatedPosts = gql`
  query getRelatedPosts($postId: ID!, $tags: [String]) {
    relatedPosts(postId: $postId, tags: $tags) {
      _id
      title
      coverImg
      slug
    }
  }
`

const RelatedPosts = graphql(getRelatedPosts, {
  options: (ownProps) => ({
    variables: {
      postId: ownProps.postId,
      tags: ownProps.tags
    }
  }),
  fetchPolicy: 'cache-and-network'
})(RelatedPostsComponent)

export default translate('post')(RelatedPosts)
