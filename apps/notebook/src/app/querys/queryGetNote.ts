import { gql } from '@apollo/client';

export const GET_USER_NOTEBOOKS = gql`
  query  GetUserNotebooks {
    getUserNotebooks {
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
