import React from 'react'
import Slider from 'react-slick'
import ChevronRight from 'react-feather/dist/icons/chevron-right'
import ChevronLeft from 'react-feather/dist/icons/chevron-left'

function NextArrow ({ className, style, onClick }) {
  return (
    <div
      className={className}
      style={{ ...style, background: 'transparent' }}
      onClick={onClick}
    >
      <ChevronRight size={40} />
    </div>
  )
}

function PrevArrow ({ className, style, onClick }) {
  return (
    <div
      className={className}
      style={{ ...style, background: 'transparent' }}
      onClick={onClick}
    >
      <ChevronLeft size={40} />
    </div>
  )
}

export default function RyfmaSlider ({ isMobile, settings, children, centerMode }) {
  const defaultSettings = {
    dots: false,
    infinite: true,
    // fade: true,
    // lazyLoad: true,
    centerMode: centerMode || isMobile,
    centerPadding: '20px',
    swipeToSlide: !!isMobile,
    slidesToShow: isMobile ? 2 : 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
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
          slidesToScroll: 1,
          swipeToSlide: true
        }
      }
    ]
  }

  if (isMobile) {
    delete defaultSettings.slidesToScroll
    delete settings.slidesToScroll
  }

  return (<Slider {...defaultSettings} {...settings}>
    {children}
  </Slider>)
}
