import React from 'react'
import { translate } from 'react-i18next'
import {Notification} from '../Notification/Notification'
import { Form, Header, Grid, Card, Icon, Modal, Button, TextArea, Container, Item } from 'semantic-ui-react'
import Share from '../Common/Share'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import SEO from '../Common/SEO'
import Loader from '../Common/Loader'
import ReactGA from 'react-ga'

const { Content } = Item

class Invites extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      inviteEmails: '',
      openInviteModal: false
    }
  }

  async sendEmails (event) {
    event.preventDefault()
    ReactGA.event({
      category: 'User',
      action: 'MassInvitesEmails',
      value: this.state.inviteEmails.length
    })
    const emailsArray = this.state.inviteEmails
      .split(/(?:\r\n|\r|\n|\s|,|;)/g)
      .filter(item => !!item)// && item !== this.props.data.me.email

    if (emailsArray.length > 50) {
      Notification.error(this.props.t('common:notif.maxInviteEmails'))
      return
    }

    const emails = {
      emails: emailsArray
    }

    try {
      await this.props.sendInvitesEmail(emails)
      this.setState({
        openInviteModal: false
      })
      Notification.success(this.props.t('common:notif.invitesSend'))
    } catch (error) {
      Notification.error(error)
    }
  }

  render () {
    const { data, t } = this.props

    if (data.loading) {
      return <Loader />
    }

    const user = data.me
    const inviteLink = `http://sf1.welyx.com/r/${user._id}`

    return (
      <Container>
        <SEO
          schema='Website'
          title={t('seoTitleInvites')}
          description={t('seoDescInvites')}
          path='me'
          contentType='website'
        />
        <Item className='user-page'>
          <Content>
            <div className='account-page'>
              <Header as='h1'>{t('headerInvites')}</Header>

              <Form warning>
                <div className='referral-block'>
                  <Header as='h3'>{t('shareLink')}</Header>
                  <Header.Subheader>
                    {t('shareLinkInfo')}
                  </Header.Subheader>
                  <Form.Group widths='equal'>
                    <Form.Input label={t('referralLink')} value={inviteLink} read-only />
                    <div className='field share-small'>
                      <label>{t('shareVia')}</label>
                      <Share
                        shareUrl={`/r/${user._id}`}
                        title={t('shareViaTitle')}
                        description={t('shareViaDesc')} />
                    </div>
                  </Form.Group>
                </div>

                <div className='referral-block'>
                  <Header as='h3'>{t('referByEmail')}</Header>
                  <Header.Subheader>
                    {t('referByEmailDesc')}
                  </Header.Subheader>
                  <Form.Group>
                    <Modal
                      trigger={
                        <Button
                          onClick={(event) => { event.preventDefault(); this.setState({ openInviteModal: true }) }}
                          color='blue'
                        >
                          {t('inviteContacts')}
                        </Button>
                      }
                      open={this.state.openInviteModal}
                      onClose={() => this.setState({ openInviteModal: false })}
                      closeIcon='close'
                    >
                      <Modal.Content>
                        <Form className='invite-emails-form'>
                          <Header as='h3'>{t('inviteFriends')}</Header>
                          <Header.Subheader>
                            {t('inviteFriendsDesc')}
                          </Header.Subheader>
                          {/* <Form.Field>
                            <Button color='google plus' onClick={(event) => event.preventDefault()}>
                              <Icon name='google' /> Invite Gmail Contacts
                            </Button>
                          </Form.Field> */}
                          <Form.Field>
                            <TextArea
                              className='invite-textarea'
                              onChange={(event) => this.setState({ inviteEmails: event.target.value })}
                              placeholder={t('inviteFriendsPlaceholder')} />
                          </Form.Field>
                          <Form.Field>
                            <Button
                              onClick={this.sendEmails.bind(this)}
                              size='big'
                              className='send-invite'
                              color={this.state.inviteEmails ? 'blue' : null}
                              disabled={!this.state.inviteEmails}
                            >
                              {t('inviteFriendsButton')}
                            </Button>
                          </Form.Field>
                        </Form>
                      </Modal.Content>
                    </Modal>
                  </Form.Group>
                </div>
              </Form>
              <div className='invited'>
                <div>{t('youInvited')}</div>
                <div className='invited-count'>{user.profile.invitesCount}</div>
                <div>{t('members', { count: user.profile.invitesCount })}</div>
              </div>
              <Grid columns={3} centered className='invites'>
                <Grid.Column>
                  <Card color={user.profile.invitesCount > 0 ? 'green' : null}>
                    <Header as='h3'>1</Header>
                    <Card.Content>
                      <Card.Header>
                        {t('inviteKarma')}
                      </Card.Header>
                      <Card.Description>
                        {t('inviteKarmaDesc')}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      {user.profile.invitesCount > 0 ? <Icon name='check' color='green' /> : <Icon name='lock' />}
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card color={user.profile.invitesCount > 4 ? 'green' : null}>
                    <Header as='h3'>10</Header>
                    <Card.Content>
                      <Card.Header>
                        {t('inviteFriend')}
                      </Card.Header>
                      <Card.Description>
                        {t('inviteFriendDesc')}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      {user.profile.invitesCount > 4 ? <Icon name='check' color='green' /> : <Icon name='lock' />}
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card color={user.profile.invitesCount > 19 ? 'green' : null}>
                    <Header as='h3'>20</Header>
                    <Card.Content>
                      <Card.Header>
                        {t('inviteLightPremium')}
                      </Card.Header>
                      <Card.Description>
                        {t('inviteLightPremiumDesc')}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      {user.profile.invitesCount > 19 ? <Icon name='check' color='green' /> : <Icon name='lock' />}
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card color={user.profile.invitesCount > 49 ? 'green' : null}>
                    <Header as='h3'>50</Header>
                    <Card.Content>
                      <Card.Header>
                        {t('inviteAmbassador')}
                      </Card.Header>
                      <Card.Description>
                        {t('inviteAmbassadorDesc')}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      {user.profile.invitesCount > 49 ? <Icon name='check' color='green' /> : <Icon name='lock' />}
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card color={user.profile.invitesCount > 99 ? 'green' : null}>
                    <Header as='h3'>100</Header>
                    <Card.Content>
                      <Card.Header>
                        {t('invitePremium')}
                      </Card.Header>
                      <Card.Description>
                        {t('invitePremiumDesc')}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      {user.profile.invitesCount > 99 ? <Icon name='check' color='green' /> : <Icon name='lock' />}
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid>
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
        invitesCount
      }
    }
  }
`

const sendInvitesEmail = gql`
  mutation sendInvitesEmail(
    $emails: [String]!,
  ) {
    sendInvitesEmail(
      emails: $emails,
    )
  }
`

const InvitesWithData = compose(
  graphql(getCurrentUser),
  graphql(sendInvitesEmail, {
    props ({ mutate }) {
      return {
        sendInvitesEmail (settingsVariables) {
          return mutate({ variables: settingsVariables })
        }
      }
    }
  })
)(Invites)

export default translate('account')(withRouter(InvitesWithData))
