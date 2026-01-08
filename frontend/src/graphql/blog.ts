import gql from 'graphql-tag'

const BLOG_FIELDS_FRAGMENT = gql`
  fragment BlogFields on BlogModel {
    id
    title
    content
    createdAt
    authorId
    authorName
  }
`
export const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      ...BlogFields
    }
  }
  ${BLOG_FIELDS_FRAGMENT}
`

export const BLOGS_QUERY = gql`
  query Blogs($filters: BlogFilterInput) {
    blogs(filters: $filters) {
      ...BlogFields
    }
  }
  ${BLOG_FIELDS_FRAGMENT}
`
