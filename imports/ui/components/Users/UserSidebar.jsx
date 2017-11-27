import React from 'react'
// import UserRecommendedUsers from './UserRecommendedUsers';
import UserShareBlock from './UserShareBlock'

class UserSidebar extends React.Component {
  render () {
    return (
      <div>
        <UserShareBlock {...this.props} />
        {/* <UserRecommendedUsers /> */}
      </div>
    )
  }
}

export default UserSidebar
