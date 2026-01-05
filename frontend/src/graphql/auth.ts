import gql from 'graphql-tag'

const USER_FIELDS_FRAGMENT = gql`
  fragment UserFields on UserModel {
    id
    userName
    email
    createdAt
    updatedAt
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const AUTO_LOGIN_QUERY = gql`
  query AutoLogin {
    autoLogin {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`
