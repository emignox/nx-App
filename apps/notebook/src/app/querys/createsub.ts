import { gql } from '@apollo/client';

export const NOTEBOOK_CREATED_SUBSCRIPTION = gql`
  subscription OnNotebookCreated {
    notebookCreated {
      _id
      title
      content
      createdAt
      updatedAt
      user {
        _id
        name
        email
      }
    }
  }
`;
