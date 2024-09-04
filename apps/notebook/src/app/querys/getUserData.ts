import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
query GetUserData {
  getUserById {
    _id
    name
    email
  }
}`;
