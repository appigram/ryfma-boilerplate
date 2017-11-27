import React from 'react'

const OnlineStatus = ({ progress }) => (
  <div className='progress'>
    <div className='progress-bar'>
      <div className='fill' style={{ width: `${progress}%` }} />
    </div>
  </div>
)

export default OnlineStatus
