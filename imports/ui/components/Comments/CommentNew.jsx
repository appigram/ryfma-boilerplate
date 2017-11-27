import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import { Button, Form, Comment, Rating } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import Loader from '../Common/Loader'
import ReviewEditor from '../Common/ReviewEditor'

import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { createEditorStateWithText } from 'draft-js-plugins-editor'

import ReactGA from 'react-ga'

// container
import withCurrentUser from '/imports/ui/containers/withCurrentUser'

class CommentNew extends React.Component {
  constructor (params) {
    super(params)
    this.state = {
      commentState: this.props.isReply ? createEditorStateWithText(this.props.replyTo) : createEditorStateWithText(''),
      newRating: 0,
      errorReview: false,
      errorRating: false
    }
  }

  async insert (event) {
    event.preventDefault()
    const rawContentState = convertToRaw(this.state.commentState.getCurrentContent())
    let markup = draftToHtml(rawContentState)
    markup = markup.replace(/<p><\/p>/gi, '').trim()

    if (markup.length < 1) {
      Notification.error(this.props.t('common:notif.writeMoreComment'))
      return
    }

    const commentVariables = {
      content: markup.trim(),
      objectType: this.props.objectType,
      objectId: this.props.objectId,
      title: this.props.title,
      userId: this.props.author._id,
      ratingCount: this.props.ratingCount,
      currRating: this.props.currRating,
      newRating: this.state.newRating
    }

    const currUser = this.props.data.me

    try {
      const response = await this.props.insertComment(commentVariables)
      ReactGA.event({
        category: 'User',
        action: 'CommentCreated'
      })
      this.setState({
        commentState: createEditorStateWithText(''),
        newRating: 0,
        errorReview: false
      })
      this.props.insertNewComment(response.data.insertComment, currUser)
      Notification.success(this.props.t('common:notif.commentAdded'))
      if (this.props.cancelReply) this.props.cancelReply()
    } catch (error) {
      console.info(error)
      Notification.error(error)
    }
  }

  onChange = (commentState) => {
    this.setState({
      commentState
    })
  }

  setRating = (newRating) => {
    this.setState({
      newRating,
      errorRating: false
    })
  }

  render () {
    const { t, isReply, objectType, data } = this.props
    if (data.loading) {
      return <Loader />
    }
    const currUser = data.me

    /*const colonsRegex = new RegExp('(^|\\s)(\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?)', 'g')
    let match
    while (match = colonsRegex.exec(content)) {
      let colons = match[2]
      let offset = match.index + match[1].length
      let length = colons.length

      console.log('Test colons')
      console.log(colons, offset, length)
    }*/

    // const showContent = content

    return (<Form className='submitCommentForm' reply={isReply} onSubmit={this.insert.bind(this)}>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src={currUser.profile.image.replace('_full_', '_middle_')} />
          <Comment.Content>
            <ReviewEditor
              id='comment-textarea'
              placeholder={isReply ? t('writeReply') : t('writeOpinion')}
              className={this.state.errorReview ? 'editable-textarea error' : 'editable-textarea'}
              onChange={this.onChange}
              editorState={this.state.commentState}
            />
            <Button content={isReply ? t('addReply') : t('addComment')} floated='right' primary />
            {isReply ? <Button className='cancelButton' content={t('common:form.cancel')} as='a' basic onClick={this.props.cancelReply} /> : null}
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Form>)
  }
}

const insertComment = gql`
  mutation insertComment(
    $content: String!,
    $objectType: String!,
    $objectId: String!,
    $title: String!,
    $userId: String!
    $ratingCount: Int,
    $currRating: Float,
    $newRating: Int,
  ) {
    insertComment(
      content: $content,
      objectType: $objectType,
      objectId: $objectId,
      title: $title,
      userId: $userId,
      ratingCount: $ratingCount,
      currRating: $currRating,
      newRating: $newRating,
    ){
      _id
      createdAt
      postedAt
      content
      objectType
      objectId
      userId
      author {
        _id
        username
        profile {
          name
          image
        }
      }
    }
  }
`

const CommentNewWithData = compose(
  graphql(insertComment, {
    props ({ mutate }) {
      return {
        insertComment (commentVariables) {
          return mutate({ variables: commentVariables })
        }
      }
    }
  })
)(CommentNew)

export default translate('comment')(withCurrentUser(withRouter(CommentNewWithData)))
