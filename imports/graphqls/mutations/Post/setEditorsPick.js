import gql from 'graphql-tag'

const setEditorsPick = gql`
  mutation setEditorsPick($_id: ID!, $title: String!, $userId: String!) {
    setEditorsPick(_id: $_id, title: $title, userId: $userId)
  }
`

export default setEditorsPick
