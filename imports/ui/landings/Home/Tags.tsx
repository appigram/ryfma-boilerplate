import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import RyfmaSlider from './RyfmaSlider'
import { useQuery } from '@apollo/client/react'
import getPopularTags from '/imports/graphqls/queries/Tag/getPopularTags'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'

function TagsPage ({ isMobile } ) {
  const [t] = useTranslation()
  
  const { loading, error, data } = useQuery(getPopularTags, {
    variables: {
      limit: 42
    }
  })

  if (loading) {
    return (<div className='slick-slider slick-initialized'>
    <div className='slick-list'>
      <div className='slick-track'>
        <div className='slick-slide'>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
        </div>
        <div className='slick-slide'>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
        </div>
        <div className='slick-slide'>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
          <div className='audio-item placeholder'>
            <div className='audio-item-image'/>
            <div className='audio-item-name'>
              <div className='audio-item-name-text' />
              <div className='audio-item-name-subtext' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const popularTags = data.popularTags

  if (popularTags.length === 0) {
    return null
  }

  const tags = popularTags.map(tag => {
    const tagName = tag.name

    const cleanTagName = tagName.replace('#', '')
    return (
      <div key={tag._id} className='card-info small tag'>
        <Link to={`/tags/${tag._id}/${tagName}`} target='_blank'>
          <img src={tag.coverImg ? tag.coverImg.replace('_full_', '_thumb_') : 'https://cdn.ryfma.com/defaults/icons/default_full_avatar.jpg'} alt={cleanTagName} width='70' height='70' />
          <div className='tag-name'>
            <h3>{cleanTagName}</h3>
            <p>Постов: {tag.count}</p>
          </div>
        </Link>
      </div>
    )
  })

  const sliderSettings = {
    slidesToShow: isMobile ? 2 : 4,
    slidesToScroll: isMobile ? 1 : 1,
    lazyLoad: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (<LazyLoadOrChildren
    height={235}
    offset={100}
    once
    placeholder={null}
  >
  <div className='top-categories pick'>
    <div className='header'>
      <h2>{t('common:popularTags')}</h2>
      <Link to='/tagsmap' className='more-link' target='_blank'>{t('common:more')}</Link>
    </div>
    <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
      <div>
        {tags.slice(0, 3)}
      </div>
      <div>
        {tags.slice(3, 6)}
      </div>
      <div>
        {tags.slice(6, 9)}
      </div>
      <div>
        {tags.slice(9, 12)}
      </div>
      <div>
        {tags.slice(12, 15)}
      </div>
      <div>
        {tags.slice(15, 18)}
      </div>
      <div>
        {tags.slice(18, 21)}
      </div>
      <div>
        {tags.slice(21, 24)}
      </div>
      <div>
        {tags.slice(24, 27)}
      </div>
      <div>
        {tags.slice(27, 30)}
      </div>
      <div>
        {tags.slice(30, 33)}
      </div>
      <div>
        {tags.slice(33, 36)}
      </div>
      <div>
        {tags.slice(36, 39)}
      </div>
      <div>
        {tags.slice(39, 42)}
      </div>
    </RyfmaSlider>
    </div>
  </LazyLoadOrChildren>
  )
}

export default TagsPage
