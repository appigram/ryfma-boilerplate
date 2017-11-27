import React from 'react'
import { Header, Button, Card, Image } from 'semantic-ui-react'

class Recommended extends React.Component {
  render () {
    return (
      <Card className='sidebar-card'>
        <Card.Content>
          <Card.Header>
            Recommended
          </Card.Header>
        </Card.Content>
        <Card.Content className='body'>
          <Image avatar src='https://cdnryfma.s3.amazonaws.com/defaults/icons/default_full_avatar.jpg' />
          <Card.Description>
            <Header as='h4'>User Name</Header>
            invite you to see his page
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button basic color='green' size='small'>Visit page</Button>
        </Card.Content>
      </Card>
    )
  }
}

export default Recommended
