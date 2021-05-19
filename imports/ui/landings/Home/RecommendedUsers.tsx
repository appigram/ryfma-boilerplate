import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Loader from '/imports/ui/components/Common/Loader'
import RyfmaSlider from './RyfmaSlider'
import Avatar from '/imports/ui/components/Common/Avatar'
import { useQuery } from '@apollo/client/react'
import getRecommendedUsers from '/imports/graphqls/queries/User/getRecommendedUsers'

function RecommendedUsers ({ isClassic = false, isMobile, limit }) {
  const [t] = useTranslation()

  const { loading, error, data } = useQuery(getRecommendedUsers, {
    variables: {
      isClassic,
      limit
    },
  })

  if (loading) {
    return <Loader />
  }

  if (error || !data.recommendedUsers) {
    return <div>Error: {error.reason || error.message}</div>
  }

  const users = data.recommendedUsers

  if (users.length < 1) {
    return null
  }

  const sliderSettings = {
    slidesToShow: isMobile ? 4 : 10,
    slidesToScroll: isMobile ? 4 : 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 10,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }
    ]
  }

  return (<div className='pick top-classic no-margin'>
    <div className='header'>
      <h2>{t('common:recommendedUsers')}</h2>
    </div>

    <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
      {users.map(user => {
        return (
          <div role='listitem' key={user._id} className='item card-info small'>
            <Avatar
              image={user.profile.image}
              username={user.username}
              name={user.profile.name}
              roles={user.roles}
              type='middle'
            />
            <div className='content card-info-content'>
              <div className='header'>
                <Link rel='author' to={`/u/${user.username}`}>
                  {user.profile.name}
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </RyfmaSlider>
  </div>)
}

export default RecommendedUsers
