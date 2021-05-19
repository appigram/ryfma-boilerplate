import gql from 'graphql-tag'

const unsetEditorsPick = gql`
  mutation unsetEditorsPick($_id: ID!, $userId: String!) {
    unsetEditorsPick(_id: $_id, userId: $userId)
  }
`

export default unsetEditorsPick
