import React from 'react'
import { Link } from 'react-router-dom'
// import { Session } from 'meteor/session';
// import { UserStatus } from 'meteor/ostrio:user-status';
import { Container, Icon, Item, List, Popup } from 'semantic-ui-react'
import { Slingshot } from 'meteor/edgee:slingshot'
import { uploadBlobToS3 } from '/lib/uploadToCloud'
import ImageEditor from '../Common/ImageEditor'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ReactGA from 'react-ga'

const { Content, Extra, Header, Meta } = Item

class UserProfileInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userAvatar: this.props.user.profile.image,
      showBio: false
    }
  }

  componentWillMount () {
    const imageRestrictions = {
      allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
      maxSize: 2 * 1024 * 1024 // 2 MB (use null for unlimited)
    }
    Slingshot.fileRestrictions('userFullImage', imageRestrictions)
    Slingshot.fileRestrictions('userMiddleImage', imageRestrictions)
    Slingshot.fileRestrictions('userSmallImage', imageRestrictions)
  }

  uploadImagesToS3 = (metaContext) => {
    const timeNow = Date.now()
    const self = this
    this.setState({
      userAvatar: metaContext.fullThumb
    })
    const fullUploader = new Slingshot.Upload('userFullImage', { filename: metaContext.filename, filenamePrefix: 'user_full_', time: timeNow })
    const middleUploader = new Slingshot.Upload('userMiddleImage', { filename: metaContext.filename, filenamePrefix: 'user_middle_', time: timeNow })
    const smallUploader = new Slingshot.Upload('userSmallImage', { filename: metaContext.filename, filenamePrefix: 'user_small_', time: timeNow })
    uploadBlobToS3(smallUploader, metaContext.smallCanvas) // async
    uploadBlobToS3(middleUploader, metaContext.middleCanvas) // async
    const fullImageUrl = uploadBlobToS3(fullUploader, metaContext.fullCanvas) // async, but waiting response
    fullImageUrl.then(function (src) {
      self.props.changeUserAvatar({ avatarUrl: src })
      ReactGA.event({
        category: 'User',
        action: 'AvatarChanged'
      })
      self.setState({
        userAvatar: src
      })
    }, function (err) {
      console.log(err)
    })
  }

  render () {
    const { currentUserId, user } = this.props
    const { userAvatar } = this.state
    let userBadge = null

    const userStatus = 'user-status-online' // TODO: user status package rewrite and user-status-offline
    /* if (UserStatus.status.get() === 'online') {
      userStatus = 'user-status-online';
    }
    else if (UserStatus.status.get() === 'idle' || Session.get('UserStatusIdle')) {
      userStatus = 'user-status-idle';
    } */

    const isOwner = currentUserId === user._id

    return (
      <Container textAlign='center'>
        <Item className='user-basic-info'>
          <div className={`user-avatar-wrapper ${userStatus}`}>
            {isOwner
              ? <ImageEditor
                className='avatar'
                defaultImg={userAvatar}
                updateCanvasData={this.uploadImagesToS3}
                objectType='user'
                objectId={user._id}
              />
              : <div className='ui huge image avatar' itemScope itemType='https://schema.org/ImageObject' itemProp='image'>
                <img className='avatar' src={userAvatar} />
              </div>
            }
            {userBadge}
          </div>
          <Content>
            <Header as='h1' itemProp='name'>{user.profile.name}</Header>
            {user.profile.website &&
              <div className='user-website'>
                <Link to={user.profile.website.indexOf('http') < 0 ? 'http://' + user.profile.website : user.profile.website} role='listitem' target='_blank' rel='nofollow noopener' className='item' itemProp='url'>
                  <Icon name='globe' size='large' />
                  {user.profile.website.replace('https://', '').replace('http://', '')}
                </Link>
              </div>
            }
            {(user.profile.vkUser ||
              user.profile.vkUser ||
              user.profile.instagramUser ||
              user.profile.twitterUser ||
              user.profile.facebookUser) &&
              <Meta>
                <List link horizontal>
                  {user.profile.vkUser
                    ? <Link to={`https://vk.com/${user.profile.vkUser}`} role='listitem' target='_blank' rel='noopener' className='item vk'>
                      <Icon name='vk' size='large' />
                    </Link>
                    : null
                  }
                  {user.profile.instagramUser
                    ? <Link to={`https://instagram.com/${user.profile.instagramUser}`} role='listitem' target='_blank' rel='noopener' className='item in'>
                      <Icon name='instagram' size='large' />
                    </Link>
                    : null
                  }
                  {user.profile.twitterUser
                    ? <Link to={`https://twitter.com/${user.profile.twitterUser}`} role='listitem' target='_blank' rel='noopener' className='item tw'>
                      <Icon name='twitter' size='large' />
                    </Link>
                    : null
                  }
                  {user.profile.facebookUser
                    ? <Link to={`https://facebook.com/${user.profile.facebookUser}`} role='listitem' target='_blank' rel='noopener' className='item fb'>
                      <Icon name='facebook' size='large' />
                    </Link>
                    : null
                  }
                  {/* <Link to={user.profile.okUser} role='listitem' target='_blank' rel='noopener' className='item ok'>
                    <Icon name='odnoklassniki' size='large' />
                  </Link> */}
                </List>
              </Meta>
            }
            {user.profile.bio && <Extra>
              {user.profile.bio.length > 650
                ? <div className='user-bio'>
                  <div className='slide-down' itemProp='disambiguatingDescription'>
                    {user.profile.bio.substring(0, 650) + '...'}
                  </div>
                  <div className='slide-down-button' onClick={() => { this.setState({ showBio: !this.state.showBio }) }}>
                    {this.state.showBio ? <Icon name='chevron up' /> : <Icon name='chevron down' />}
                  </div>
                  <div className={this.state.showBio ? 'slide-down-hidden open' : 'slide-down-hidden'} itemProp='disambiguatingDescription'>
                    {user.profile.bio.substr(650)}
                  </div>
                </div>
                : <span itemProp='disambiguatingDescription'>{user.profile.bio}</span>
              }
            </Extra>
            }
          </Content>
        </Item>
      </Container>
    )
  }
}

const changeUserAvatar = gql`
  mutation changeUserAvatar(
    $avatarUrl: String!,
  ) {
    changeUserAvatar(
      avatarUrl: $avatarUrl,
    )
  }
`

UserProfileInfo = graphql(changeUserAvatar, {
  props ({ mutate }) {
    return {
      changeUserAvatar (userVariables) {
        return mutate({ variables: userVariables })
      }
    }
  }
})(UserProfileInfo)

export default UserProfileInfo
