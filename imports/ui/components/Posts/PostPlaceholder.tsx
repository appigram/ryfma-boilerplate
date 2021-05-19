import React from 'react'

function PostPlaceholder () {
  return (
    <div className='item post-list-item post-placeholder'>
      <div className='content'>
        <div className='post-title'>
          <div className='post-avatar' />
          <div className='post-title-info'>
            <div className='post-title-header' />
            <div className='post-title-bottom' />
          </div>
        </div>

        <div className='description'>
          <div className='post-body'>
            <div>
              <div className='post-body-string' />
              <div className='post-body-string' />
              <div className='post-body-string' />
              <div className='post-body-string' />
            </div>
            <a className='post-cover-img' />
          </div>
          <div className='post-body-read-more' />
        </div>
      </div>
    </div>
  )
}

export default PostPlaceholder
