import React from 'react'
import { translate } from 'react-i18next'
import { withCookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import { Container, Grid, Header } from 'semantic-ui-react'
import Sidebar from '../components/Sidebar/Sidebar'
import PostsList from '../components/Posts/PostsList'
import SEO from '../components/Common/SEO'
import { isMobile } from '../../../lib/utils/deviceDetect'

const Home = ({ t, staticContext, cookies }) => {
  const authenticated = typeof window !== 'undefined' ? !!cookies.get('meteor_login_token') : staticContext.authenticated
  const checkMobile = typeof window !== 'undefined' ? isMobile() : staticContext.isMobile
  return (<div>
    <SEO
      schema='WebPage'
      title={t('common:home.seoTitle')}
      description={t('common:home.seoDesc')}
      path='/'
      contentType='website'
    />
    {!authenticated &&
      <div id='home'>
        <div className='ui segment masthead'>
          <div className='outer'>
            <div className='middle'>
              <div className='inner'>
                <div className='information'>
                  <Header as='h1'>
                    {t('common:home.header1')}<br />
                    {t('common:home.header2')}
                  </Header>
                  <p className='lead'>{t('common:home.subHeader1')} <br />{t('common:home.subHeader2')}</p>
                  <Link to='/register' className='ui button'>{t('common:home.buttonHidden')}</Link>
                </div>
                {!checkMobile &&
                  <div className='banner'>
                    <div className='banner-grad'>
                      <div className='banner-grad-inner' />
                    </div>
                    <div className='image-wrapper'>
                      <img src='https://cdnryfma.s3.amazonaws.com/defaults/icons/HomeBanner600.png' alt='MO.ST - стихи и книги, которые Вы полюбите' />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    <Container className='main-content'>
      {!checkMobile
        ? <Grid columns={2} className='post-list-wrapper'>
          <Grid.Column width={12}>
            <div className='ui segment posts-list-wrapper'>
              <PostsList type='latest' />
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <Sidebar />
          </Grid.Column>
        </Grid>
        : <Grid columns={1} className='post-list-wrapper'>
          <Grid.Column width={16}>
            <div className='ui segment posts-list-wrapper'>
              <PostsList type='latest' />
            </div>
          </Grid.Column>
        </Grid>
      }
    </Container>
  </div>)
}

export default translate()(withCookies(Home))
