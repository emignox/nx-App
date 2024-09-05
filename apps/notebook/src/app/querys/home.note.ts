import {gql} from '@apollo/client';


export interface UserNotebooksProps {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      _id: string;
    };
  }
  
  export const GET_USER_NOTEBOOKS = gql`
    query GetUserNotebooks {
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