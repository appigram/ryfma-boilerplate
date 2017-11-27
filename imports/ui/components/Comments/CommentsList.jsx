import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import { Comment, Header } from 'semantic-ui-react'
import CommentItem from './CommentItem'
import CommentNew from './CommentNew'
import store from '/lib/store'
import { graphql, compose } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import ReactGA from 'react-ga'

class CommentsList extends React.Component {
  constructor (params) {
    super(params)
    this.state = {
      comments: [],
      content: '',
      commentsCount: this.props.commentsCount
    }
  }

  componentDidMount () {
    this.onMount()
  }

  onMount = () => {
    this.setState({
      comments: this.props.comments
    })
  }

  insertNewComment = (params, author) => {
    const newComment = {
      __typename: 'Comment',
      _id: params._id,
      author: {
        __typename: 'User',
        _id: author._id,
        username: author.username,
        profile: {
          __typename: 'UserProfile',
          name: author.profile.name,
          image: author.profile.image
        }
      },
      content: params.content,
      createdAt: params.createdAt,
      objectType: params.objectType,
      objectId: params.objectId,
      postedAt: params.postedAt,
      userId: params.userId,
      spamScore: 0,
      replyTo: params.replyTo
    }

    const comments = [...this.state.comments, newComment]
    this.setState({
      comments,
      commentsCount: this.state.commentsCount + 1
    })

    setTimeout(() => {
      const element = document.getElementById(params.id)
      if (element) element.scrollIntoView()
    }, 1000)

    setTimeout(() => {
      this.setState({
        opacityComment: 0
      })
    }, 5000)
  }

  async deleteComment (commentId, objectType, objectId, removeIndex) {
    const comments = this.state.comments.filter((item, index) => {
      return index !== removeIndex
    })

    this.setState({
      comments,
      commentsCount: this.state.commentsCount - 1
    })

    try {
      const response = await this.props.deleteComment({ _id: commentId, userId: this.props.author._id, objectType: objectType, objectId: objectId })
      ReactGA.event({
        category: 'User',
        action: 'CommentDeteled'
      })
      if (response) Notification.success(this.props.t('common:notif.commentDeleted'))
    } catch (error) {
      console.info(error)
      Notification.error(error)
    }
  }

  async markCommentAsSpam (commentId, commentUserId, spamScore) {
    try {
      const response = await this.props.markCommentAsSpam({ _id: commentId, postUserId: this.props.author._id, commentUserId: commentUserId, spamScore: spamScore })
      ReactGA.event({
        category: 'User',
        action: 'CommentMarkerAsSpam'
      })
      if (response) Notification.success(this.props.t('common:notif.commentMarkedAsSpam'))
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { author, title, objectType, objectId, currRating, ratingCount, reviewed, t } = this.props
    const { comments, commentsCount } = this.state
    const isLogged = !!store.getItem('Meteor.userId')

    let header = <Header as='h3' dividing>{t('writeComment')}</Header>

    let newCommentBlock = <div className='comment-new-wrapper'><div className='auth-required'>{t('loginReq1')} <Link to='/login'>{t('loginReqLink')}</Link> {t('loginReq2')}</div></div>

    if (isLogged) {
      newCommentBlock = <div>
        {header}
        {!reviewed && <CommentNew
          author={author}
          objectType={objectType}
          objectId={objectId}
          title={title}
          insertNewComment={this.insertNewComment}
          currRating={currRating}
          ratingCount={ratingCount}
        />}
      </div>
    }

    return (
      <Comment.Group itemScope itemType='http://schema.org/UserComments' id='comments'>
        {newCommentBlock}

        <Header as='h3' dividing>{t('comments')} <i>({commentsCount || 0})</i></Header>

        {comments.length > 0
          ? comments.map((comment, index) =>
            <CommentItem
              reviewed={reviewed}
              key={comment._id}
              comment={comment}
              author={author}
              objectType={objectType}
              objectId={objectId}
              title={title}
              index={index}
              deleteComment={this.deleteComment.bind(this)}
              insertNewComment={this.insertNewComment}
              markCommentAsSpam={this.markCommentAsSpam.bind(this)}
            />
          )
          : <div className='no-content small'>
            {t('firstComment')}
          </div>
        }

        {!isLogged && comments.length > 10 &&
          <div className='auth-required' style={{ marginTop: '4em' }}>{t('loginReq1')} <Link to='/login'>{t('loginReqLink')}</Link> {t('loginReq2')}</div>
        }

      </Comment.Group>
    )
  }
}

const deleteComment = gql`
  mutation deleteComment($_id: ID!, $userId: String!, $objectType: String!, $objectId: String!) {
    deleteComment(
      _id: $_id,
      userId: $userId,
      objectType: $objectType,
      objectId: $objectId
    )
  }
`

const markCommentAsSpam = gql`
  mutation markCommentAsSpam($_id: ID!, $postUserId: String!, $commentUserId: String!, $spamScore: Int!) {
    markCommentAsSpam(
      _id: $_id,
      postUserId: $postUserId,
      commentUserId: $commentUserId,
      spamScore: $spamScore
    )
  }
`

const CommentsListWithData = compose(
  graphql(deleteComment, {
    props ({ mutate }) {
      return {
        deleteComment (commentVariables) {
          return mutate({ variables: commentVariables })
        }
      }
    }
  }),
  graphql(markCommentAsSpam, {
    props ({ mutate }) {
      return {
        markCommentAsSpam (commentVariables) {
          return mutate({ variables: commentVariables })
        }
      }
    }
  })
)(CommentsList)

export default translate('comment')(withRouter(CommentsListWithData))
