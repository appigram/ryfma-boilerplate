import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Instagram from 'react-feather/dist/icons/instagram'
import Twitter from 'react-feather/dist/icons/twitter'
import Facebook from 'react-feather/dist/icons/facebook'
import VK from '/imports/shared/svg/vk'
import OK from '/imports/shared/svg/ok'

import { List, Button } from 'semantic-ui-react'

function MobileFooter () {
  const [t] = useTranslation('footer')
  const { pathname } = useLocation()

  const hiddenPath = pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/recover-password') ||
    pathname.includes('/reset-password') ||
    pathname.includes('/new-album') ||
    pathname.includes('/new-post') ||
    pathname.includes('/new-contest') ||
    pathname.includes('/new-book') ||
    pathname.includes('/new-chapter') ||
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
          <List.Item><Link to='/aboutus'>{t('aboutUs')}</Link></List.Item>
          <List.Item><Link to='/faq'>{t('helpAndFaq')}</Link></List.Item>
          <List.Item><Link to='/press'>{t('pressKit')}</Link></List.Item>
          <List.Item><a href='mailto:info@ryfma.com'>{t('contact')}</a></List.Item>
          <List.Item><Link to='/terms' rel='noopener nofollow'>{t('termsOfUse')}</Link></List.Item>
          {/* <List.Item><Link to='/adv'>Advertise</Link></List.Item> */}
        </List>
        <div className='mobile-app-download android-app'>
          <Button animated='fade'>
            <Button.Content visible><i aria-hidden='true' className='icon android' />Android</Button.Content>
            <Button.Content hidden>
              Coming soon
            </Button.Content>
          </Button>
        </div>
        <div className='mobile-app-download ios-app'>
          <Button animated='fade'>
            <Button.Content visible><i aria-hidden='true' className='icon apple' />iOS</Button.Content>
            <Button.Content hidden>
              Coming soon
            </Button.Content>
          </Button>
        </div>
        <div className='social-links'>
          <List link horizontal inverted className='social-menu'>
            <List.Item as='a' href='https://instagram.com/_ryfma_' target='_blank' rel='noopener' className='in'>
              <Instagram /><b>90k</b>
            </List.Item>
            <List.Item as='a' href='https://vk.com/ryfma_poet' target='_blank' rel='noopener' className='vk'>
              <VK /><b>15k</b>
            </List.Item>
            <List.Item as='a' href='https://twitter.com/ryfma' target='_blank' rel='noopener' className='tw'>
              <Twitter /><b>2k</b>
            </List.Item>
            <List.Item as='a' href='https://www.facebook.com/ryfma' target='_blank' rel='noopener' className='fb'>
              <Facebook /><b>1000</b>
            </List.Item>
            <List.Item as='a' href='http://ok.ru/ryfma' target='_blank' rel='noopener' className='ok'>
              <OK /><b>1000</b>
            </List.Item>
          </List>
        </div>
        <div className='menu-copyright'>
          <div className='copyright'>
            Ryfma © 2015-2017. {t('allRightsReserved')} <span className='age-law'>12+</span>
          </div>
          <List horizontal className='payment-menu'>
            <List.Item>
              <i aria-hidden='true' className='icon visa' />
            </List.Item>
            <List.Item>
              <i aria-hidden='true' className='icon mastercard' />
            </List.Item>
            <List.Item>
              <i aria-hidden='true' className='icon credit-card alternative' />
            </List.Item>
          </List>
        </div>
      </div>
    </div>
  )
}

export default MobileFooter
