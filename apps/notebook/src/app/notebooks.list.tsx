import React from 'react';
import Styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { NotebookType } from "../../../../api/src/notebook/notebook.type";

const GET_NOTEBOOKS = gql`
  query GetNotebooks {
    notebooks {
      _id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const NotebookList = Styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    color: #555;
  }

  p {
    margin: 10px 0 0;
    color: #666;
  }
`;

const NotebookListComponent: React.FC = () => {
  const { loading, error, data } = useQuery<{ notebooks: NotebookType[] }>(GET_NOTEBOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <NotebookList>
      <h1>Notebooks</h1>
      <ul>
        {data?.notebooks.map((notebook: NotebookType) => (
          <li key={notebook._id}>
            <h2>{notebook.title}</h2>
            <p>{notebook.content}</p>
          </li>
        ))}
      </ul>
    </NotebookList>
  );
};

export function Notebook() {
  return (
    <div>
      <NotebookListComponent />
    </div>
  );
}

export default Notebook;