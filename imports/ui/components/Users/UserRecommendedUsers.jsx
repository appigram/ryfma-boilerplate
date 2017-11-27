import React from 'react'
import { Card } from 'semantic-ui-react'

// import UsersList from './UsersList';

class UserRecommendedUsers extends React.Component {
  render () {
    return (
      <Card className='sidebar-card'>
        <Card.Content>
          <Card.Header>
            Recommended Users
          </Card.Header>
        </Card.Content>
        <Card.Content className='body'>
          Users here
        </Card.Content>
      </Card>
    )
  }
}

export default UserRecommendedUsers
