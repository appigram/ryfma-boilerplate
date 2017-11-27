import React from 'react'
import { Link } from 'react-router-dom'
import { translate } from 'react-i18next'
import { List, Icon, Button } from 'semantic-ui-react'

class MobileFooter extends React.Component {
  render () {
    const { t } = this.props
    const pathname = window.location.pathname

    const hiddenPath = pathname.includes('/login') ||
      pathname.includes('/register') ||
      pathname.includes('/recover-password') ||
      pathname.includes('/reset-password') ||
      pathname.includes('/new-book') ||
      pathname.includes('/edit') ||
      pathname.includes('/email-verification')

    let headerClassName = 'footer mobile-footer'
    if (hiddenPath) {
      headerClassName = 'footer mobile-footer hidden'
    }

    return (
      <div className={'ui segment inverted ' + headerClassName}>
        <div className='page' textAlign='center'>
          <List link inverted className='pages-links'>
            <List.Item><Link to='/aboutus'>{t('common:footer.aboutUs')}</Link></List.Item>
            <List.Item><Link to='/faq'>{t('common:footer.helpAndFaq')}</Link></List.Item>
            <List.Item><Link to='/press'>{t('common:footer.pressKit')}</Link></List.Item>
            <List.Item><a href='mailto:info@ryfma.ru'>{t('common:footer.contact')}</a></List.Item>
            <List.Item><Link to='/terms'>{t('common:footer.termsOfUse')}</Link></List.Item>
            {/* <List.Item><Link to='/adv'>Advertise</Link></List.Item> */}
          </List>
          <div className='mobile-app-download android-app'>
            <Button animated='fade'>
              <Button.Content visible><Icon name='android' />Android</Button.Content>
              <Button.Content hidden>
                Coming soon
              </Button.Content>
            </Button>
          </div>
          <div className='mobile-app-download ios-app'>
            <Button animated='fade'>
              <Button.Content visible><Icon name='apple' />iOS</Button.Content>
              <Button.Content hidden>
                Coming soon
              </Button.Content>
            </Button>
          </div>
          <div className='social-links'>
            <List link horizontal inverted className='social-menu'>
              <List.Item as='a' href='https://instagram.com/_ryfma_' target='_blank' rel='noopener' className='in'>
                <Icon name='instagram' size='large' /><b>80k</b>
              </List.Item>
              <List.Item as='a' href='https://vk.com/ryfma_poet' target='_blank' rel='noopener' className='vk'>
                <Icon name='vk' size='large' /><b>20k</b>
              </List.Item>
              <List.Item as='a' href='https://twitter.com/ryfma' target='_blank' rel='noopener' className='tw'>
                <Icon name='twitter' size='large' /><b>10k</b>
              </List.Item>
              <List.Item as='a' href='https://www.facebook.com/ryfma' target='_blank' rel='noopener' className='fb'>
                <Icon name='facebook' size='large' /><b>500</b>
              </List.Item>
              <List.Item as='a' href='http://ok.ru/ryfma' target='_blank' rel='noopener' className='ok'>
                <Icon name='odnoklassniki' size='large' /><b>1k</b>
              </List.Item>
            </List>
          </div>
          <div className='menu-copyright'>
            <div className='copyright'>
              MO.ST © 2015-2017. {t('common:footer.allRightsReserved')} <span className='age-law'>12+</span>
            </div>
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
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(MobileFooter)
