import { gql } from '@apollo/client';

export const UPDATE_USER_INFO_MUTATION = gql`
  mutation UpdateUserInfo($updateUserInput: UpdateUserInput!) {
    updateUserInfo(updateUserInput: $updateUserInput) {
      _id
      name
      email
    }
  }
`;
