import gql from 'graphql-tag'

const increasePostViewCount = gql`
  mutation increasePostViewCount($_id: ID!, $userId: String, $status: Int) {
    increasePostViewCount(_id: $_id, userId: $userId, status: $status)
  }
`

export default increasePostViewCount
