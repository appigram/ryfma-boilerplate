import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import RyfmaSlider from './RyfmaSlider'
import { useQuery } from '@apollo/client/react'
import getBooks from '/imports/graphqls/queries/Book/getBooks'
import Loader from '/imports/ui/components/Common/Loader'
import BooksListPreviewItem from '/imports/ui/components/Books/List/BooksListPreviewItem'
import LazyLoadOrChildren from '/imports/ui/components/Common/LazyLoadOrChildren'

function PopularBooks ({ isMobile, currUserId }) {
  const [t] = useTranslation()

  const { loading, error, data } = useQuery(getBooks, {
    variables: {
      bookSort: 'liked',
      bookDate: 'thisYear',
      bookPrice: 'paid',
      skip: 0,
      limit: 20
    }
  })

  if (loading) {
    return <Loader />
  }

  if (error) {
    return null
  }


  const sliderSettings = {
    slidesToShow: isMobile ? 3 : 7,
    slidesToScroll: isMobile ? 3 : 6,
    lazyLoad: !currUserId,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 7
        }
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 6
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 5
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  }

  if (!currUserId) {
    return (<LazyLoadOrChildren
      height={235}
      offset={100}
      once
      placeholder={null}
    >
    <div className='pick top-books'>
      <div className='header'>
        <h2>{t('common:popularBooks')}</h2>
        <Link to='/books/all' className='more-link' target='_blank'>{t('common:more')}</Link>
      </div>
      <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
        {data.books.items.map((book, index) => <BooksListPreviewItem key={book._id} book={book} />)}
      </RyfmaSlider>
    </div>
    </LazyLoadOrChildren>)
  }

  return (
    <div className='pick top-books'>
      <div className='header'>
        <h2>{t('common:popularBooks')}</h2>
        <Link to='/books/all' className='more-link' target='_blank'>{t('common:more')}</Link>
      </div>
      <RyfmaSlider settings={sliderSettings} isMobile={isMobile}>
        {data.books.items.map((book, index) => <BooksListPreviewItem key={book._id} book={book} />)}
      </RyfmaSlider>
    </div>)
}


export default PopularBooks
