import React, { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, Header, Checkbox, Container, Item } from 'semantic-ui-react'
import saveSettings from '/imports/graphqls/mutations/User/saveSettings'
import { useAuth } from '/imports/hooks'
import { Notification } from '/imports/ui/components/Notification/Notification'
import SEO from '/imports/ui/components/Common/SEO'

const { Content } = Item

function Unsubscribe () {
  const [t] = useTranslation(['account', 'form', 'notif'])
  const { currUser } = useAuth()
  const { userId } = useParams()
  const settings = currUser ? currUser.settings : {
    emailUpdates: true,
    emailAuthor: true,
    emailReader: true,
    emailSponsored: true,
    emailNewFollower: false,
    emailComments: true,
    emailToAllFollowers: true,
    emailMessage: true,
    emailPayment: true,
    emailSubscription: true
  }
  const [emailUpdates, setEmailUpdates] = useState(settings.emailUpdates)
  const [emailAuthor, setEmailAuthor] = useState(settings.emailAuthor)
  const [emailReader, setEmailReader] = useState(settings.emailReader)
  const [emailSponsored, setEmailSponsored] = useState(settings.emailSponsored)
  const [emailNewFollower, setEmailNewFollower] = useState(settings.emailNewFollower || false)
  const [emailComments, setEmailComments] = useState(settings.emailComments)
  const [emailToAllFollowers, setEmailToAllFollowers] = useState(settings.emailToAllFollowers)
  const [emailMessage, setEmailMessage] = useState(settings.emailMessage)
  const [emailPayment, setEmailPayment] = useState(settings.emailPayment)
  const [emailSubscription, setEmailSubscription] = useState(settings.emailSubscription)

  const [saveSettingsMutation] = useMutation(saveSettings)

  const handleSaveSettings = async (event) => {
    const settingsVariables = {
      userId,
      emailUpdates,
      emailAuthor,
      emailReader,
      emailSponsored,
      emailNewFollower,
      emailComments,
      emailToAllFollowers,
      emailMessage,
      emailPayment,
      emailSubscription
    }
    try {
      await saveSettingsMutation({ variables: settingsVariables })
      Notification.success(t('notif:accountUpdated'))
    } catch (error) {
      Notification.error(error)
    }
  }

  return (
    <Container>
      <SEO
        schema='Website'
        title={t('seoEmailTitle')}
        description={t('seoEmailDesc')}
        path='unsubscribe'
        contentType='website'
        noIndex={true}
        noFollow={true}
      />
      <Item className='user-page'>
        <Content>
          <div className='account-page'>
            <Header as='h1'>{t('emailHeader')}</Header>
            <Header.Subheader>
              {t('emailSubheader')}
            </Header.Subheader>

            <div className='email-page unsubscribe'>
              <Form>
                <Header as='h3'>{t('emailAnnouncements')}</Header>
                <Form.Field
                  onChange={(event, { name, value }) => setEmailUpdates(!emailUpdates)}
                  control={Checkbox}
                  label={t('emailUpdates')}
                  checked={emailUpdates}
                />
                <Form.Field
                  onChange={(event, { name, value }) => setEmailAuthor(!emailAuthor)}
                  control={Checkbox}
                  label={t('emailAuthor')}
                  checked={emailAuthor}
                />
                <Form.Field
                  onChange={(event, { name, value }) => setEmailReader(!emailReader)}
                  control={Checkbox}
                  label={t('emailReader')}
                  checked={emailReader}
                />
                <Form.Field
                  onChange={(event, { name, value }) => setEmailSponsored(!emailSponsored)}
                  control={Checkbox}
                  label={t('emailSponsored')}
                  checked={emailSponsored}
                />

                <Header as='h3'>{t('emailNotifications')}</Header>
                <Form.Field
                  onChange={(event, { name, value }) => setEmailNewFollower(!emailNewFollower)}
                  control={Checkbox}
                  label={t('emailNewFollower')}
                  checked={emailNewFollower}
                />
                <Form.Field
                  onChange={(event, { name, value }) => setEmailComments(!emailComments)}
                  control={Checkbox}
                  label={t('emailComments')}
                  checked={emailComments}
                />
                <br />
                <Form.Button onClick={handleSaveSettings} color='green'>{t('form:save')}</Form.Button>
              </Form>
            </div>
          </div>
        </Content>
      </Item>
    </Container>
  )
}

export default Unsubscribe
