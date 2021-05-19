import React from 'react'
import LazyLoad from 'react-lazyload'

function LazyLoadOrChildren ({ children, placeholder, ...rest }) {
  if (typeof window === 'undefined') {
    return children
  }
  return <LazyLoad {...rest}>{children}</LazyLoad>
}

export default LazyLoadOrChildren
