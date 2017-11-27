import React from 'react'
import { translate } from 'react-i18next'
import { Form, Header, Container, Item, Input } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {Notification} from '../Notification/Notification'
import gql from 'graphql-tag'
import SEO from '../Common/SEO'
import Loader from '../Common/Loader'

const { Content } = Item

class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      bio: '',
      website: '',
      vkUser: '',
      facebookUser: '',
      twitterUser: '',
      instagramUser: ''
    }
  }

  componentDidMount () {
    this.onMount()
  }

  onMount = () => {
    const profile = this.props.data.me.profile
    if (profile) {
      this.setState(profile)
    }
  }

  async saveProfile (event) {
    event.preventDefault()

    const profileVariables = this.state
    try {
      await this.props.saveProfile(profileVariables)
      Notification.success(this.props.t('common:notif.accountUpdated'))
    } catch (error) {
      Notification.error(error)
    }
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render () {
    const { data, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    const userInfo = this.state

    return (
      <Container>
        <SEO
          schema='Website'
          title={t('seoProfileTitle')}
          description={t('seoProfileTitle')}
          path='me/profile'
          contentType='website'
        />
        <Item className='user-page'>
          <Content>
            <div className='account-page'>
              <Header as='h1'>{t('profileHeader')}</Header>
              <Header.Subheader>
                {t('profileSubheader')}
              </Header.Subheader>

              <div className='settings'>
                <Form onSubmit={this.saveProfile.bind(this)}>
                  <Header as='h3'>{t('profileAboutYou')}</Header>
                  <Form.Group widths='equal'>
                    <Form.Input value={userInfo.firstname || ''} onChange={this.handleInputChange} name='firstname' label={t('profileFirstName')} type='text' />
                    <Form.Input value={userInfo.lastname || ''} onChange={this.handleInputChange} name='lastname' label={t('profileSecondName')} type='text' />
                  </Form.Group>
                  <Form.TextArea value={userInfo.bio || ''} onChange={this.handleInputChange} name='bio' label={t('profileShortBio')} rows='3' />

                  <Header as='h3'>{t('profileSocialMedia')}</Header>
                  {/* <p>Connect your social media accounts</p>
                  <Form.Group inline className='connect-social'>
                    <Form.Button color='vk'>Connect to VK</Form.Button>
                    <Form.Button color='facebook'>Connect to Facebook</Form.Button>
                    <Form.Button color='twitter'>Connect to Twitter</Form.Button>
                  </Form.Group> */}
                  <Form.Field>
                    <label>{t('profileWebsite')}</label>
                    <Input value={userInfo.website || ''} onChange={this.handleInputChange} name='website' type='text' />
                  </Form.Field>
                  <Form.Field>
                    <label>{t('profileVK')}</label>
                    <Input value={userInfo.vkUser || ''} onChange={this.handleInputChange} name='vkUser' label='vk.com/' type='text' placeholder='username' />
                  </Form.Field>
                  <Form.Field>
                    <label>{t('profileInstagram')}</label>
                    <Input value={userInfo.instagramUser || ''} onChange={this.handleInputChange} name='instagramUser' label='instagram.com/' type='text' placeholder='username' />
                  </Form.Field>
                  <Form.Field>
                    <label>{t('profileFacebook')}</label>
                    <Input value={userInfo.facebookUser || ''} onChange={this.handleInputChange} name='facebookUser' label='facebook.com/' type='text' placeholder='username' />
                  </Form.Field>
                  <Form.Field>
                    <label>{t('profileTwitter')}</label>
                    <Input value={userInfo.twitterUser || ''} onChange={this.handleInputChange} name='twitterUser' label='twitter.com/' type='text' placeholder='username' />
                  </Form.Field>
                  <Form.Button type='submit' color='green'>{t('common:form.save')}</Form.Button>
                </Form>
              </div>
            </div>
          </Content>
        </Item>
      </Container>
    )
  }
}

const getCurrentUser = gql`
  query getCurrentUser {
    me {
      _id
      profile {
        firstname
        lastname
        bio
        website
        twitterUser
        instagramUser
        vkUser
        facebookUser
      }
    }
  }
`

const saveProfile = gql`
  mutation saveProfile(
    $firstname: String,
    $lastname: String,
    $bio: String,
    $website: String,
    $vkUser: String,
    $facebookUser: String,
    $twitterUser: String,
    $instagramUser: String,
  ) {
    saveProfile(
      firstname: $firstname,
      lastname: $lastname,
      bio: $bio,
      website: $website,
      vkUser: $vkUser,
      facebookUser: $facebookUser,
      twitterUser: $twitterUser,
      instagramUser: $instagramUser,
    )
  }
`

const ProfileWithData = compose(
  graphql(getCurrentUser),
  graphql(saveProfile, {
    props ({ mutate }) {
      return {
        saveProfile (profileVariables) {
          return mutate({ variables: profileVariables })
        }
      }
    }
  })
)(Profile)

export default translate('account')(withRouter(ProfileWithData))
