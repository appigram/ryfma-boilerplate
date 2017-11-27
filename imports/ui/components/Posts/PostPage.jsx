import React from 'react'
import { translate } from 'react-i18next'
import TimeAgoExt from '../Common/TimeAgoExt'
import { Link, withRouter } from 'react-router-dom'
import { Container, Icon, Item, Label, Header, Popup } from 'semantic-ui-react'
import LazyLoad from 'react-lazyload'
import Loader from '../Common/Loader'
import {Notification} from '../Notification/Notification'
import CommentsList from '../Comments/CommentsList'
import Share from '../Common/Share'
import SEO from '../Common/SEO'
import RelatedPosts from './RelatedPosts'
import UserInfoItem from '../Users/UserInfoItem'
import PostTag from './PostTag'
import store from '/lib/store'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import ReactGA from 'react-ga'

const { Content, Image, Meta, Description } = Item

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

class PostPage extends React.Component {
  constructor (params) {
    super(params)
    this.state = {
      liked: false,
      likes: 0,
      saved: false,
      saves: 0,
      isSpeaking: false
    }
  }

  async componentDidMount () {
    try {
      if (this.props.match.params.postId) {
        await this.props.increasePostViewCount({_id: this.props.match.params.postId})
        setTimeout(() => {
          this.onMount()
        }, 300)
      }
    } catch (err) {
    }
  }

  componentWillUnmount () {
    if (synth) {
      if (synth.speaking) {
        synth.cancel()
      }
    }
  }

  onMount = () => {
    this.setState({
      likes: this.props.data.getPost.likeCount,
      liked: this.props.data.getPost.liked,
      saves: this.props.data.getPost.savedCount,
      saved: this.props.data.getPost.saved
    })
  }

  async likePost () {
    try {
      await this.props.likePost({
        _id: this.props.match.params.postId,
        title: this.props.data.getPost.title,
        userId: this.props.data.getPost.userId
      })
      ReactGA.event({
        category: 'User',
        action: 'PostLiked'
      })
      this.setState({
        liked: true,
        likes: this.state.likes + 1
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  async unLikePost () {
    try {
      await this.props.unLikePost({
        _id: this.props.match.params.postId,
        userId: this.props.data.getPost.userId
      })
      ReactGA.event({
        category: 'User',
        action: 'PostUnliked'
      })
      this.setState({
        liked: false,
        likes: this.state.likes - 1
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  async savePost () {
    try {
      await this.props.savePost({
        _id: this.props.match.params.postId,
        title: this.props.data.getPost.title,
        userId: this.props.data.getPost.userId
      })
      ReactGA.event({
        category: 'User',
        action: 'PostSaved'
      })
      this.setState({
        saved: true,
        saves: this.state.saves + 1
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  async unSavePost () {
    try {
      await this.props.unSavePost({
        _id: this.props.match.params.postId,
        userId: this.props.data.getPost.userId
      })
      ReactGA.event({
        category: 'User',
        action: 'PostUnsaved'
      })
      this.setState({
        saved: false,
        saves: this.state.saves - 1
      })
    } catch (error) {
      Notification.error(error)
    }
  }

  handleSpeakOn = () => {
    const voices = synth.getVoices()
    const txt = this.props.data.getPost.htmlBody.replace(/<p>/gi, '\n').replace(/<\/p>/gi, '\n')
    const utterThis = new SpeechSynthesisUtterance(txt)

    utterThis.voice = voices[44]
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].lang === 'ru-RU' && voices[i].name === 'Yuri') {
        utterThis.voice = voices[i]
      }
    }
    utterThis.pitch = 0.7
    utterThis.rate = 0.85
    synth.speak(utterThis)
    ReactGA.event({
      category: 'User',
      action: 'PostListen'
    })
    this.setState({
      isSpeaking: true
    })
  }

  handleSpeakOff = () => {
    synth.cancel()
    this.setState({
      isSpeaking: false
    })
  }

  render () {
    const { t } = this.props
    const { getPost, loading, error } = this.props.data

    if (loading) {
      return <Loader />
    }

    if (error) {
      return <Container>
        <SEO
          schema='Article'
          title={t('postNotFoundTitle')}
          description={t('postNotFoundDesc')}
          path={`p/${this.props.match.params.postId}`}
          contentType='article'
        />
        <Item className='post-page not-found-content'>
          <Content>
            <Icon name='write square' />
            <h1>{t('postNotFoundTitle')}</h1>
            <p>{t('postNotFoundDesc')}</p>
            <Link to='/'>{t('postNotFoundLink')}</Link>
          </Content>
        </Item>
      </Container>
    }
    const post = getPost
    const currUserId = store.getItem('Meteor.userId')
    const postBody = post.htmlBody.replace(/<p><\/p>/gi, '<br/>')
    const postTags = post.tags.map((tag) => {
      return tag.name.toLowerCase()
    })
    const postLikes = this.state.likes
    const postViews = post.viewCount || 0
    const postLiked = this.state.liked
    const postSaves = this.state.saves
    const postSaved = this.state.saved
    const postTagsIds = post.tags.map(item => item._id)
    const isOwner = currUserId === post.author._id

    return (
      <Container>
        <SEO
          schema='NewsArticle'
          title={t('seoTitle') + '"' + post.title + '" · ' + post.author.profile.name}
          description={postBody}
          image={post.coverImg}
          path={`p/${post._id}/${post.slug}`}
          contentType='article'
          published={post.createdAt}
          updated={post.postedAt}
          category={postTags[0]}
          tags={t('common:home.seoKeywords') + postTags.join(', ')}
          twitter={post.author.profile.twitterUser}
        />
        <meta itemScope itemProp='mainEntityOfPage' itemType='https://schema.org/WebPage' itemID='https://google.com/article' />
        <Item className='post-page'>
          <Content>
            <div className='post-title'>
              <div className='post-title-info'>
                <div className='post-title-bottom'>
                  <span className='post-date'>
                    <TimeAgoExt date={post.createdAt} />
                  </span>
                </div>
                <div className='post-title-header'>
                  <Header as='h1' itemProp='headline'>
                    {post.title}
                  </Header>
                  {synth &&
                    <Popup
                      className='blue-popup'
                      trigger={<span className='speech-block'>{this.state.isSpeaking
                        ? <Icon name='volume up' onClick={() => this.handleSpeakOff()} />
                        : <Icon name='volume off' onClick={() => this.handleSpeakOn()} />}</span>}
                      content={'Прослушать текст'}
                      position='bottom center'
                      size='mini'
                    />}
                  {isOwner &&
                    <span className='post-actions'>
                      <Link to={`/p/${post._id}/${post.slug}/edit`}>
                        <Icon name='edit' link />
                        {t('common:edit')}
                      </Link>
                    </span>
                  }
                </div>
              </div>
            </div>

            <PostTag tags={post.tags} />

            <Description>
              {post.coverImg ?
                <LazyLoad height={235} offset={150} once placeholder={<div className='img-placeholder' />}>
                  <Image itemScope itemType='https://schema.org/ImageObject' itemProp='image' src={post.coverImg} alt={post.tags ? post.tags.map(tag => tag.name).join(',') : post.title} />
                </LazyLoad>
                 : null}
              <div itemProp='description' className='post-body' dangerouslySetInnerHTML={{ __html: postBody }} />
            </Description>
            <Meta className='post-footer'>
              <div className='post-stat-share'>
                <div className='share-block'>
                  {/*<Label basic><Icon name='eye' color='grey' />{postViews}</Label>*/}
                  <Popup
                    trigger={<Label basic className='post-share-label'><Icon name='share alternate' color='grey' /><span>0</span></Label>}
                    content={<Share
                      shareUrl={`/p/${post._id}/${post.slug}`}
                      title={`Читайте стих "${post.title}" на MO.ST`}
                      description={postBody.length > 300 ? postBody.substring(0, 300) + '...' : postBody}
                      image={post.coverImg}
                      hashtags={postTags}
                    />}
                    position='top center'
                    size='mini'
                    on='click'
                  />
                  <Label
                    basic
                    onClick={postSaved ? this.unSavePost.bind(this) : this.savePost.bind(this)}
                    className='post-save-label'
                  >
                    {postSaved
                      ? <Icon className='post-save' name='bookmark' color='green' />
                      : <Icon className='post-save' name='remove bookmark' color='grey' />
                    }
                    <span>{postSaves}</span>
                  </Label>
                  <Label
                    basic
                    className='post-like-label'
                  >
                    {postLiked
                      ? <Icon className='post-like' name='heart' color='red' onClick={postLiked ? this.unLikePost.bind(this) : this.likePost.bind(this)} />
                      : <Icon className='post-like' name='empty heart' color='grey' onClick={postLiked ? this.unLikePost.bind(this) : this.likePost.bind(this)} />
                    }
                    <Link className='post-likers-link' to={`/p/${post._id}/${post.slug}/likers`}>{postLikes}</Link>
                  </Label>
                </div>
              </div>
              <UserInfoItem user={post.author} itsme={currUserId === post.author._id} isPost />
            </Meta>
            {post.tags && <RelatedPosts type='horizontal' postId={post._id} tags={postTagsIds} />}
          </Content>
          <CommentsList
            author={post.author}
            objectType='post'
            objectId={post._id}
            title={post.title}
            commentsCount={post.commentsCount}
            comments={post.comments}
          />
        </Item>
      </Container>
    )
  }
}

const getPostInfo = gql`
  query getPostInfo($postId: ID!) {
    getPost(postId: $postId) {
      _id
      createdAt
      postedAt
      title
      slug
      htmlBody
      likeCount
      liked
      viewCount
      savedCount
      saved
      commentsCount
      lastCommentedAt
      clickCount
      userId
      coverImg
      tags {
        _id
        name
        slug
      }
      author {
        _id
        username
        isFollowing
        profile {
          name
          image
          twitterUser
        }
      }
      comments {
        _id
        createdAt
        postedAt
        content
        objectType
        objectId
        userId
        spamScore
        author {
          _id
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
  }
`

const likePost = gql`
  mutation likePost($_id: ID!, $title: String!, $userId: String!) {
    likePost(
      _id: $_id,
      title: $title,
      userId: $userId,
    )
  }
`

const unSavePost = gql`
  mutation unSavePost($_id: ID!, $userId: String!) {
    unSavePost(
      _id: $_id,
      userId: $userId
    )
  }
`

const savePost = gql`
  mutation savePost($_id: ID!, $title: String!, $userId: String!) {
    savePost(
      _id: $_id,
      title: $title,
      userId: $userId,
    )
  }
`

const unLikePost = gql`
  mutation unLikePost($_id: ID!, $userId: String!) {
    unLikePost(
      _id: $_id,
      userId: $userId
    )
  }
`

const increasePostViewCount = gql`
  mutation increasePostViewCount($_id: ID!) {
    increasePostViewCount(
      _id: $_id
    )
  }
`

const PostPageWithData = compose(
  graphql(getPostInfo, {
    options: (ownProps) => ({
      variables: {
        postId: ownProps.match.params.postId
      },
      fetchPolicy: ownProps.location.search.includes('refresh') ? 'network-only' : 'cache-first'
    })
  }),
  graphql(likePost, {
    props ({ mutate }) {
      return {
        likePost (likeVariables) {
          return mutate({ variables: likeVariables })
        }
      }
    }
  }),
  graphql(unLikePost, {
    props ({ mutate }) {
      return {
        unLikePost (unLikeVariables) {
          return mutate({ variables: unLikeVariables })
        }
      }
    }
  }),
  graphql(savePost, {
    props ({ mutate }) {
      return {
        savePost (saveVariables) {
          return mutate({ variables: saveVariables })
        }
      }
    }
  }),
  graphql(unSavePost, {
    props ({ mutate }) {
      return {
        unSavePost (unSaveVariables) {
          return mutate({ variables: unSaveVariables })
        }
      }
    }
  }),
  graphql(increasePostViewCount, {
    props ({ mutate }) {
      return {
        increasePostViewCount ({_id}) {
          return mutate({ variables: { _id } })
        }
      }
    }
  })
)(PostPage)

export default translate('post')(withRouter(PostPageWithData))
