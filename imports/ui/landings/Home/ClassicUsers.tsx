import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import RyfmaSlider from './RyfmaSlider'
import Avatar from '/imports/ui/components/Common/Avatar'

const classicUsers = [
  {
    _id: 'afsdk8kjq7bywxj9C', username: 'aleksandr-pushkin', img: 'https://cdn.ryfma.com/images/afsdk8kjq7bywxj9C/users/user_full_1602778691683_800px-orest_kiprensky_-_portret_poeta_a-s-pushkina_-_google_art_project-jpg.jpg', name: 'Александр Пушкин',
  },
  {
    _id: 'SfiyyBogmzJjF7NeN', username: 'vladimir-vysockii', img: 'https://cdn.ryfma.com/images/SfiyyBogmzJjF7NeN/users/user_full_1602778986539_1427816308-vladimir-vysockij-jpg.jpg', name: 'Владимир Высоцкий',
  },
  {
    _id: '5s5u426xco2HeiWbi', username: 'anna-akhmatova', img: 'https://cdn.ryfma.com/images/5s5u426xco2HeiWbi/users/user_full_1602851914063_kuzma_petrov-vodkin-_portrait_of_anna_akhmatova-_1922-jpg.jpg', name: 'Анна Ахматова',
  },
  {
    _id: 'XkYdE6BuWJCwj4yaY', username: 'marina-cvetaeva', img: 'https://cdn.ryfma.com/images/XkYdE6BuWJCwj4yaY/users/user_full_1603191766636_tsvetaeva-jpg.jpg', name: 'Марина Цветаева',
  },
  {
    _id: 'e8go65CKoQQs3jXgu', username: 'eduard-asadov', img: 'https://cdn.ryfma.com/images/e8go65CKoQQs3jXgu/users/user_full_1603288373916_02_p3yqe3m-jpg.jpg', name: 'Эдуард Асадов',
  },
  {
    _id: '7oCMnLWCQ2ebRmAaP', username: 'sergei-esenin', img: 'https://cdn.ryfma.com/images/7oCMnLWCQ2ebRmAaP/users/user_full_1602841429846_sergey_yesenin_2-jpg.jpg', name: 'Сергей Есенин',
  },
  {
    _id: 'HBCuf9RPvXz9NBWXg', username: 'bella-akhmadulina', img: 'https://cdn.ryfma.com/images/HBCuf9RPvXz9NBWXg/users/user_full_1603273793149_bella_akhmadulina-jpg.jpg', name: 'Белла Ахмадулина',
  },
  {
    _id: 'ejGSFZYhxHzpgHCSa', username: 'aleksandr-blok', img: 'https://cdn.ryfma.com/images/ejGSFZYhxHzpgHCSa/users/user_full_1602778210668_800px-alexander_blok-jpeg.jpg', name: 'Александр Блок',
  },
  {
    _id: 'LHBdHdh3Ttm6gZZAx', username: 'iosif-brodskii', img: 'https://cdn.ryfma.com/images/Zc9BSkQyDR6u5KXpZ/users/user_full_1602784270184_joseph_brodsky_1988-jpg.jpg', name: 'Иосиф Бродский',
  },
  {
    _id: 'dnMvYYKHfE9ckb2Ld', username: 'pasternak-boris', img: 'https://cdn.ryfma.com/images/dnMvYYKHfE9ckb2Ld/users/user_full_1602857299568_377px-boris_pasternak_1928-jpg.jpg', name: 'Пастернак Борис',
  },
  {
    _id: 'xJevju8PcrJg3uHtf', username: 'vladimir-mayakovskii', img: 'https://cdn.ryfma.com/images/o5Mkd2p9aytNpMs84/users/user_full_1602782276136_390px-majakovszkij-jpg.jpg', name: 'Владимир Маяковский',
  },
  {
    _id: 'S83WS9BZ68XcBaP9s', username: 'igor-severyanin', img: 'https://cdn.ryfma.com/images/S83WS9BZ68XcBaP9s/users/user_full_1602777031485_igor_severyanin-jpg.jpg', name: 'Игорь Северянин',
  },
  {
    _id: '3vHn2kGDJkooW3QLo', username: 'evgenii-evtushenko', img: 'https://cdn.ryfma.com/images/3vHn2kGDJkooW3QLo/users/user_full_1603020218486_800px-evtushenko-jpg.jpg', name: 'Евгений Евтушенко',
  },
  {
    _id: '4MHmwFNmLr3tYkTYp', username: 'fedor-tyutchev', img: 'https://cdn.ryfma.com/images/4MHmwFNmLr3tYkTYp/users/user_full_1602849209388_fedor_tutchev-jpg.jpg', name: 'Федор Тютчев',
  },
]
  
function ClassicUsers ({ isMobile }) {
  const [t] = useTranslation()
  const sliderSettings = {
    slidesToShow: isMobile ? 3 : 10,
    slidesToScroll: isMobile ? 3 : 5,
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
          slidesToScroll: 4
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

  return (<div className='pick top-classic'>
    <div className='header'>
      <h2>{t('common:classic')}</h2>
      <Link to='/classic' className='more-link' target='_blank'>{t('common:more')}</Link>
    </div>

    <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
      {classicUsers.map(user => {
        return (
          <div role='listitem' key={user._id} className='item card-info small'>
            <Avatar
              image={user.img}
              username={user.username}
              name={user.name}
              type='middle'
              bigBadge
            />
            <div className='content card-info-content'>
              <div className='header'>
                <Link rel='author' to={`/u/${user.username}`}>
                  {user.name}
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </RyfmaSlider>
  </div>)
}

export default ClassicUsers
