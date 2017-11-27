import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { Form, Header, Checkbox, Message, Container, Item } from 'semantic-ui-react'
import { changePassword } from '../Common/meteor-apollo-accounts'
import gql from 'graphql-tag'
import {Notification} from '../Notification/Notification'
import SEO from '../Common/SEO'
import Loader from '../Common/Loader'

const { Content } = Item

class Settings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      newPassword: '',
      oldPassword: '',
      usernameCanUse: false,
      usernameChanged: false,
      emailCommentedPost: false,
      emailFeaturedPost: false,
      emailPrivateMessage: false,
      emailMentionsMe: false,
      subscribeToEmail: false,
      subscribeSponsorEmail: false,
      allowPrivateMessages: false,
      adsFree: false
    }
  }

  componentDidMount () {
    this.onMount()
  }

  onMount = () => {
    setTimeout(() => {
      const user = this.props.data.me
      if (user) {
        const stateObj = {
          username: user.username,
          email: user.email,
          newPassword: '',
          oldPassword: '',
          ...user.settings
        }
        this.setState(stateObj)
      }
    }, 1000)
  }

  async updatePassword (event) {
    event.preventDefault()

    const { newPassword, oldPassword } = this.state

    if (newPassword !== oldPassword) {
      try {
        await changePassword({ oldPassword, newPassword }, this.props.client)
        Notification.success(this.props.t('common:notif.passwordChanged'))
        this.setState({
          newPassword: '',
          oldPassword: ''
        })
      } catch (error) {
        Notification.error(error)
      }
    } else {
      Notification.error(this.props.t('common:notif.passwordEquals'))
    }
  }

  async checkUsername () {
    if (!this.state.usernameChanged) {
      return
    }
    try {
      const response = await this.props.checkIfUsernameExists({ username: this.state.username })
      const canUse = !response.data.checkIfUsernameExists
      if (canUse) {
        this.setState({
          usernameCanUse: true
        })
      } else {
        this.setState({
          usernameCanUse: false
        })
      }
    } catch (error) {
      Notification.error(error)
    }
  }

  async saveSettings (event) {
    event.preventDefault()

    const settingsVariables = {
      username: this.state.username,
      emailCommentedPost: this.state.emailCommentedPost,
      emailFeaturedPost: this.state.emailFeaturedPost,
      emailPrivateMessage: this.state.emailPrivateMessage,
      emailMentionsMe: this.state.emailMentionsMe,
      subscribeToEmail: this.state.subscribeToEmail,
      subscribeSponsorEmail: this.state.subscribeSponsorEmail,
      allowPrivateMessages: this.state.allowPrivateMessages,
      adsFree: this.state.adsFree
    }

    try {
      await this.props.saveSettings(settingsVariables)
      Notification.success(this.props.t('common:notif.accountUpdated'))
    } catch (error) {
      Notification.error(error)
    }
  }

  handleInputChange = (name, value, type, checked, checkboxName) => {
    const valueS = type === 'checkbox' ? checked : value
    const nameS = checkboxName || name

    this.setState({
      [nameS]: valueS
    })
  }

  render () {
    const { data, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    const userSettings = this.state
    return (
      <Container>
        <SEO
          schema='Website'
          title={t('seoSettingsTitle')}
          description={t('seoSettingsDesc')}
          path='me/settings'
          contentType='website'
        />
        <Item className='user-page'>
          <Content>
            <div className='account-page'>
              <Header as='h1'>{t('settingsHeader')}</Header>
              <Header.Subheader>
                {t('settingsSubheader1')}<br />{t('settingsSubheader2')}
              </Header.Subheader>

              <div className='settings'>
                <Form loading={!userSettings.email}>
                  <Header as='h3'>{t('settingsAccount')}</Header>
                  <Form.Input
                    onChange={(event, { name, value }) => this.handleInputChange(name, value)}
                    name='email'
                    label={t('common:form.email')}
                    value={userSettings.email}
                    type='email'
                    disabled
                  />
                  <Form.Input
                    onChange={(event, { name, value }) => {
                      this.setState({
                        usernameChanged: true
                      })
                      this.handleInputChange(name, value)
                    }}
                    onBlur={() => this.checkUsername()}
                    name='username'
                    label={t('common:form.username')}
                    value={userSettings.username}
                    type='text'
                  />
                  {userSettings.usernameChanged
                    ? (userSettings.usernameCanUse
                      ? <Message
                        success
                        content={t('settingsUsernameFree')}
                      />
                      : <Message
                        error
                        content={t('settingsUsernameUsed')}
                      />
                    )
                    : null
                  }

                  <Header as='h3'>{t('settingsChangePassword')}</Header>
                  <Form.Group widths='equal'>
                    <Form.Input onChange={(event, { name, value }) => this.handleInputChange(name, value)} name='oldPassword' label={t('settingsCurrentPassword')} type='password' />
                    <Form.Input onChange={(event, { name, value }) => this.handleInputChange(name, value)} name='newPassword' label={t('settingsNewPassword')} type='password' />
                    <Form.Button style={{ marginTop: '1.6em' }} color='green' onClick={this.updatePassword.bind(this)}>{t('settingsSavePassword')}</Form.Button>
                  </Form.Group>

                  {/* <Header as='h3'>Default post settings</Header>
                  <Form.Field control={Checkbox} label='Share on VK' defaultChecked />
                  <Form.Field control={Checkbox} label='Share on Facebook' defaultChecked />
                  <Form.Field control={Checkbox} label='Share on Twitter' defaultChecked /> */}

                  <Header as='h3'>{t('settingsEmailMe')}</Header>
                  <Form.Field
                    onChange={(event, { name, value }) => this.handleInputChange(name, value, 'checkbox', !userSettings.emailCommentedPost, 'emailCommentedPost')}
                    control={Checkbox}
                    label={t('settingsEmailMeComments')}
                    checked={!!userSettings.emailCommentedPost}
                  />
                  <Form.Field
                    onChange={(event, { name, value }) => this.handleInputChange(name, value, 'checkbox', !userSettings.emailPrivateMessage, 'emailPrivateMessage')}
                    control={Checkbox}
                    label={t('settingsEmailMeMessages')}
                    checked={!!userSettings.emailPrivateMessage}
                    disabled
                  />

                  <Header as='h3'>{t('settingsSubscribeMe')}</Header>
                  <Form.Field
                    onChange={(event, { name, value }) => this.handleInputChange(name, value, 'checkbox', !userSettings.subscribeToEmail, 'subscribeToEmail')}
                    control={Checkbox}
                    label={t('settingsSubscribeNewsletter')}
                    checked={!!userSettings.subscribeToEmail}
                  />
                  <Form.Field
                    onChange={(event, { name, value }) => this.handleInputChange(name, value, 'checkbox', !userSettings.subscribeSponsorEmail, 'subscribeSponsorEmail')}
                    control={Checkbox}
                    label={t('settingsSubscribeSponsored')}
                    checked={!!userSettings.subscribeSponsorEmail}
                  />

                  <Header as='h3'>{t('settingsPremium')}</Header>
                  <Form.Field onChange={(event, { name, value }) => this.handleInputChange(name, value)} control={Checkbox} label={t('settingsPremiumPosts')} defaultChecked={false} disabled />
                  <Form.Field onChange={(event, { name, value }) => this.handleInputChange(name, value)} control={Checkbox} label={t('settingsPremiumAdsFree')} defaultChecked={false} disabled />
                  <Form.Field onChange={(event, { name, value }) => this.handleInputChange(name, value)} control={Checkbox} label={t('settingsPremiumExport')} defaultChecked={false} disabled />
                  <Form.Field onChange={(event, { name, value }) => this.handleInputChange(name, value)} control={Checkbox} label={t('settingsPremiumMessages')} defaultChecked={false} disabled />

                  <Form.Button onClick={() => this.saveSettings()} color='green'>{t('common:form.save')}</Form.Button>

                  {/* <Header as='h3'>Security options</Header>
                  <Header as='h4'>Sign out of all other sessions</Header>
                  <p>This will sign you out of sessions in other browsers or on other computers.</p>
                  <Button basic>Sign out other sessions</Button>
                  <Header as='h4'>Deactivate account</Header>
                  <p>Deactivating your account will remove it from Middle within a few minutes. You can sign back in anytime to reactivate your account and restore its content.</p>
                  <a href='javascript:null'>Deactivate account</a>
                  <Header as='h4'>Delete account</Header>
                  <p>Permanently delete your account, all your data, photos, comments, likes, achievements, followers, unlockables. EVERYTHING and all of your content.</p>
                  <a href='javascript:null'>Delete account</a> */}

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
      username
      email
      profile {
        locale
      }
      settings {
        emailCommentedPost
        emailFeaturedPost
        emailPrivateMessage
        emailMentionsMe
        subscribeToEmail
        subscribeSponsorEmail
        allowPrivateMessages
        adsFree
      }
    }
  }
`

const checkIfUsernameExists = gql`
  mutation checkIfUsernameExists($username: String!) {
    checkIfUsernameExists(
      username: $username
    )
  }
`

const saveSettings = gql`
  mutation saveSettings(
    $username: String,
    $emailCommentedPost: Boolean,
    $emailFeaturedPost: Boolean,
    $emailPrivateMessage: Boolean,
    $emailMentionsMe: Boolean,
    $subscribeToEmail: Boolean,
    $subscribeSponsorEmail: Boolean,
    $allowPrivateMessages: Boolean,
    $adsFree: Boolean,
  ) {
    saveSettings(
      username: $username,
      emailCommentedPost: $emailCommentedPost,
      emailFeaturedPost: $emailFeaturedPost,
      emailPrivateMessage: $emailPrivateMessage,
      emailMentionsMe: $emailMentionsMe,
      subscribeToEmail: $subscribeToEmail,
      subscribeSponsorEmail: $subscribeSponsorEmail,
      allowPrivateMessages: $allowPrivateMessages,
      adsFree: $adsFree,
    )
  }
`

const SettingsWithData = compose(
  graphql(getCurrentUser),
  graphql(checkIfUsernameExists, {
    props ({ mutate }) {
      return {
        checkIfUsernameExists (username) {
          return mutate({ variables: username })
        }
      }
    }
  }),
  graphql(saveSettings, {
    props ({ mutate }) {
      return {
        saveSettings (settingsVariables) {
          return mutate({ variables: settingsVariables })
        }
      }
    }
  })
)(Settings)

export default translate('account')(withApollo(withRouter(SettingsWithData)))
