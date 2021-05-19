import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import RyfmaSlider from './RyfmaSlider'
// import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'
import { useQuery } from '@apollo/client/react'
import getTopPosts from '/imports/graphqls/queries/Post/getTopPosts'

function EditorsPosts ({ isMobile }) {
  const [t] = useTranslation()

  const { loading, error, data } = useQuery(getTopPosts)

  if (loading) {
    return <div className='pick top-posts'>
      <div className='header'>
        <h2>{t('common:editorsChoice')}</h2>
        <Link to='/picks' className='more-link' target='_blank'>{t('common:more')}</Link>
      </div>
      <div className='slick-slider slick-initialized'>
        <div className='slick-list'>
          <div className='slick-track'>
            <div className='slick-slide top-item placeholder'>
              <div className='top-item-image'/>
              <div className='top-item-image-text' />
            </div>
            <div className='slick-slide top-item placeholder'>
              <div className='top-item-image'/>
              <div className='top-item-image-text' />
            </div>
            <div className='slick-slide top-item placeholder'>
              <div className='top-item-image'/>
              <div className='top-item-image-text' />
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const topPosts = data.topPosts

  if (topPosts.length === 0) {
    return null
  }

  const sliderSettings = {
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: isMobile ? 1 : 4,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
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

  return (
    <div className='pick top-posts'>
      <div className='header'>
        <h2>{t('common:editorsChoice')}</h2>
        <Link to='/picks' className='more-link' target='_blank'>{t('common:more')}</Link>
      </div>
      <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
        {topPosts.map(post => {
          return (<div key={post._id} className='top-item'>
            <Link to={`/p/${post._id}/${post.slug}`} aria-label={post.title} target='_blank'>
              <div className='ui image'>
                <img src={post.coverImg.replace('_full_', '_thumb_')} alt={post.title} title={post.title} width={150} height={150} />
              </div>
              <h3>{post.title}</h3>
            </Link>
            {/* !isMobile && <div className='tags'>
              {post.tags.map((tag, i) => (
                <div key={tag._id} className='ui label post-tag'>
                  <Link to={`/tags/${tag._id}/${tag.name}`}>
                    {tag.name}
                  </Link>
                </div>
              ))}
            </div> */}
          </div>)
        })}
      </RyfmaSlider>
    </div>)
}

export default EditorsPosts
