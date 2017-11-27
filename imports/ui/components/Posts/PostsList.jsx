import React from 'react'
import { translate } from 'react-i18next'
import { Item, Icon } from 'semantic-ui-react'
import Loader from '../Common/Loader'
import {Notification} from '../Notification/Notification'
// import Stories from '../Common/Stories';
import EmptyBlock from '../Common/EmptyBlock'
import PostsListItem from './PostsListItem'
import PostsListItemShort from './PostsListItemShort'
// import PromoPost from './PromoPost';
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import store from '/lib/store'

const { Group } = Item

const POSTS_PER_PAGE = 15

const getLatestPosts = gql`
  query getLatestPosts($type: String, $userId: String, $tagId: String, $duration: String, $withImage: Boolean, $skip: Int, $limit: Int) {
    posts(type: $type, userId: $userId, tagId: $tagId, duration: $duration, withImage: $withImage, skip: $skip, limit: $limit) {
      _id
      createdAt
      title
      slug
      excerpt
      coverImg
      author {
        username
        emails {
          verified
        }
        profile {
          name
          image
        }
      }
    }
  }
`

class PostsListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipPosts: 0,
      posts: [],
      infinityLoading: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.type !== nextProps.type) {
      this.props.data.refetch()
      this.setState({
        skipPosts: 0,
        posts: [],
        infinityLoading: true
      })
    }
  }

  getPostsData = () => {
    return this.state.posts.length > 0 ? this.state.posts : this.props.data.posts
  }

  fetchMorePosts = (skipPosts) => {
    const posts = this.getPostsData()
    this.props.client.query({
      query: getLatestPosts,
      variables: {
        type: this.props.type,
        userId: this.props.userId,
        tagId: this.props.tagId,
        duration: this.props.duration,
        skip: skipPosts,
        limit: POSTS_PER_PAGE
      }
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // Update posts data
        if (data.posts) {
          this.setState({
            skipPosts,
            posts: [...posts, ...data.posts],
            infinityLoading: data.posts.length === POSTS_PER_PAGE
          })
        }
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  render () {
    const { data, shortPost, /* showStories, showAds, */ userId, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return <div>Error: { data.error.message }</div>
    }

    const getPosts = this.getPostsData()

    if (getPosts.length === 0) {
      const currUserId = store.getItem('Meteor.userId')
      return <EmptyBlock iconName='newspaper' header={t('noPosts')} text={userId ? (currUserId === userId ? t('writeFirstPost') : t('userNoPosts')) : t('postNotFound')} />
    }

    return (
      <Group divided className='post-list'>
        {/* showStories ? <Stories /> : null */}
        {getPosts.map((post, index) => {
          const postItem = shortPost
            ? <PostsListItemShort key={post._id} post={post} />
            : <PostsListItem key={post._id} post={post} />

          return (
            <div>
              {/* index === 3 && showAds && <PromoPost /> */}
              {postItem}
            </div>
          )
        })
        }
        {this.state.infinityLoading && getPosts.length > (POSTS_PER_PAGE - 1)
          ? <div className='loadmore-button' onClick={() => this.fetchMorePosts(this.state.skipPosts + POSTS_PER_PAGE)}>
            <Icon name='refresh' />
            {t('common:showMore')}
          </div>
          : null
        }
      </Group>
    )
  }
}

const PostsList = graphql(getLatestPosts, {
  options: (ownProps) => ({
    variables: {
      type: ownProps.type,
      userId: ownProps.userId,
      tagId: ownProps.tagId,
      duration: ownProps.duration,
      withImage: ownProps.withImage,
      skip: 0,
      limit: POSTS_PER_PAGE
    }
  })
})(withApollo(PostsListComponent))

export default translate('post')(PostsList)
