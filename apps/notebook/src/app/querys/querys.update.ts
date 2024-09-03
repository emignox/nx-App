
import { gql } from '@apollo/client';

export const UPDATE_NOTEBOOK_MUTATION = gql`
    mutation UpdateNotebook($id:String!,$updateNotebookInput : UpdateNotebookInput!){
        updateNotebook(id:$id,updateNotebookInput:$updateNotebookInput){
          _id
          title
          content
          createdAt
          updatedAt
          user{
            _id
          }
        }
    }`;

    export const NOTEBOOK_UPDATED_SUBSCRIPTION = gql`
    subscription OnNotebookUpdated {
        notebookUpdated {
          _id
          title
          content
          createdAt
          updatedAt
    }
    }`;