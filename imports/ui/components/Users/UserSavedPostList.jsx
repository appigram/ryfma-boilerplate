import React from 'react'
import { translate } from 'react-i18next'
import { Item, Icon } from 'semantic-ui-react'
import Loader from '../Common/Loader'
import {Notification} from '../Notification/Notification'
import EmptyBlock from '../Common/EmptyBlock'
import Stories from '../Common/Stories'
import PostListItem from '../Posts/PostsListItem'
import PostListItemShort from '../Posts/PostsListItemShort'
import PromoPost from '../Posts/PromoPost'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const { Group } = Item

const getSaved = gql`
  query getSaved($sortType: String, $userId: String, $tagId: String) {
    getSaved(sortType: $sortType, userId: $userId, tagId: $tagId) {
      _id
      createdAt
      title
      slug
      excerpt
      coverImg
      author {
        username
        profile {
          name
          image
        }
      }
    }
  }
`

class UserSavedPostListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skipPosts: 0,
      posts: [],
      infinityLoading: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.sortType !== nextProps.sortType) {
      this.props.data.refetch()
      this.setState({
        skipPosts: 0,
        posts: [],
        infinityLoading: true
      })
    }
  }

  getPostsData = () => {
    return this.state.posts.length > 0 ? this.state.posts : this.props.data.getSaved
  }

  fetchMorePosts = (skipPosts) => {
    const posts = this.getPostsData()
    this.props.client.query({
      query: getSaved,
      variables: {
        sortType: this.props.sortType,
        userId: this.props.userId,
        tagId: this.props.tagId,
        skip: skipPosts,
        limit: 2
      }
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // Update posts data
        if (data.getSaved) {
          this.setState({
            skipPosts,
            posts: [...posts, ...data.getSaved],
            infinityLoading: data.getSaved.length === 2
          })
        }
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  render () {
    const { data, shortPost, showStories, showAds, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return <div>Error: { data.error.message }</div>
    }

    const getPosts = this.getPostsData()

    if (getPosts.length === 0) {
      return <EmptyBlock iconName='bookmark outline' header={t('noSavedPosts')} text={t('noSavedPostsText')} />
    }

    return (
      <Group divided className='post-list'>
        {showStories ? <Stories /> : null}
        {getPosts.map((post, index) => {
          const postItem = shortPost
          ? <PostListItemShort key={post._id} post={post} />
          : <PostListItem key={post._id} post={post} />

          return (
            <div>
              {index === 3 && showAds ? <PromoPost /> : null}
              {postItem}
            </div>
          )
        })
        }
        {this.state.infinityLoading && getPosts.length > 19
          ? <div className='loadmore-button' onClick={() => this.fetchMorePosts(this.state.skipPosts + 1)}>
            <Icon name='refresh' />
            {t('common:showMore')}
          </div>
          : null
        }
      </Group>
    )
  }
}

const UserSavedPostList = graphql(getSaved, {
  options: (ownProps) => ({
    variables: {
      sortType: ownProps.sortType,
      userId: ownProps.userId,
      tagId: ownProps.tagId,
      skip: 0,
      limit: 2
    }
  })
})(withApollo(UserSavedPostListComponent))

export default translate('user')(UserSavedPostList)
