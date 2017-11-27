import React from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../Common/SEO'
import { Grid, Card, Icon, Popup, Header, Container, Item } from 'semantic-ui-react'
const { Content } = Item

const Dashboard = ({ t }) => (
  <Container>
    <SEO
      schema='Website'
      title={t('seoTitleDash')}
      description={t('seoDescDash')}
      path='me'
      contentType='website'
    />
    <Item className='user-page'>
      <Content>
        <div className='account-page'>
          <Header as='h1'>{t('headerDash')}</Header>
          <Header.Subheader>
            {t('subheaderDash')}
          </Header.Subheader>
          <Grid columns={3} doubling className='dashboard'>
            <Grid.Row>
              <Grid.Column>
                <Card>
                  <Link to='/me/profile/'><Icon name='user' size='big' /></Link>
                  <Card.Content>
                    <Card.Header>
                      <Link to='/me/profile/'>{t('dashProfileTitle')}</Link>
                    </Card.Header>
                    <Card.Description>
                      {t('dashProfileDesc')}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Link to='/me/settings/'><Icon name='settings' size='big' /></Link>
                  <Card.Content>
                    <Card.Header>
                      <Link to='/me/settings/'>{t('dashSettingsTitle')}</Link>
                    </Card.Header>
                    <Card.Description>
                      {t('dashSettingsDesc')}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Link to='/me/invites/'><Icon name='mail' size='big' /></Link>
                  <Card.Content>
                    <Card.Header>
                      <Link to='/me/invites/'>{t('dashInvitesTitle')}</Link>
                    </Card.Header>
                    <Card.Description>
                      {t('dashInvitesDesc')}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className='inactive'>
                <Card>
                  <Icon name='dollar' size='big' />
                  <Popup
                    trigger={<div className='badge-icon'><Icon name='clock' size='small' /></div>}
                    content={t('comingSoon')}
                    positioning='top center'
                    size='mini'
                    inverted
                  />
                  <Card.Content>
                    <Card.Header>
                      {t('dashSalesTitle')}
                    </Card.Header>
                    <Card.Description>
                      {t('dashSalesDesc')}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Content>
    </Item>
  </Container>
)

export default translate('account')(Dashboard)
