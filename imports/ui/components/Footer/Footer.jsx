import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { Grid, List, Icon, Button } from 'semantic-ui-react'

const Footer = ({ t, isMobile }) => (
  <div className={isMobile ? 'ui segment inverted footer mobile-footer' : 'ui segment inverted footer'}>
    <Grid className='page' textAlign='center'>
      <Grid.Row className='pages-links'>
        <Grid.Column width={3}>
          <List link inverted>
            <List.Item className='header'>{t('common:footer.header1')}</List.Item>
            <List.Item><Link to='/'>{t('common:footer.aboutUs')}</Link></List.Item>
          </List>
        </Grid.Column>
        <Grid.Column width={3}>
          <List link inverted>
            <List.Item className='header'>{t('common:footer.header3')}</List.Item>
            <List.Item><a href='mailto:info@ryfma.ru'>{t('common:footer.contact')}</a></List.Item>
            {/* <List.Item><Link to='/adv'>Advertise</Link></List.Item> */}
          </List>
        </Grid.Column>
        <Grid.Column width={3} className='mobile-app-download ios-app'>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className='menu-copyright'>
        <Grid.Column width={8} className='copyright' textAlign='left'>
          MO.ST © 2015-2017. {t('common:footer.allRightsReserved')} <span className='age-law'>12+</span>
        </Grid.Column>
        <Grid.Column width={8} textAlign='right'>
          <List horizontal className='payment-menu'>
            <List.Item>
              <Icon name='visa' />
            </List.Item>
            <List.Item>
              <Icon name='mastercard' />
            </List.Item>
            <List.Item>
              <Icon name='credit card alternative' />
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
)

export default translate()(Footer)
