import React from 'react'
import TopPosts from './TopPosts'
import LatestTags from './LatestTags'

class Sidebar extends React.Component {
  render () {
    return (
      <div className='sidebar'>
        <TopPosts />
        <LatestTags />
      </div>
    )
  }
}

export default Sidebar
