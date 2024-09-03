import { gql } from '@apollo/client';

export const GET_USER_NOTEBOOK_BY_ID = gql`
  query GetUserNotebook($id: String!) {
    getUserNotebook(id: $id) {
      _id
      title
      content
      createdAt
      updatedAt
      user {
        _id
      }
    }
  }
`;
