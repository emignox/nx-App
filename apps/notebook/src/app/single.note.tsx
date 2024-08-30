import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { NotebookType } from '../../../../api/src/notebook/notebook.type';
import UpdateNotebookForm from './update.notebook';
import { FaPlus } from 'react-icons/fa';

const GET_NOTEBOOK_BY_ID = gql`
  query GetNotebookById($id: String!) {
    notebook(id: $id) {
      _id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const NotebookDetail: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const { id } = useParams();
  const { loading, error, data } = useQuery<{ notebook: NotebookType }>(GET_NOTEBOOK_BY_ID, {
    variables: { id },
  });

  if (loading) return <Spinner size="xl" />;
  if (error) return (
    <Alert status="error">
      <AlertIcon />
      Error: {error.message}
    </Alert>
  );

  if (!data?.notebook) return <p>No notebook found</p>;

  return (
    <Box width="100%" maxWidth="800px" margin="0 auto" padding="20px" bg="white" borderRadius="md" boxShadow="md"marginTop={'10'}>
      {openForm ? (
        <UpdateNotebookForm onClose={() => setOpenForm(false)} />
      ) : (
        <Button onClick={() => setOpenForm(true)}>
          <FaPlus /> Update Notebook
        </Button>
      )}
      <Heading as="h1" size="xl" marginBottom="4">{data.notebook.title}</Heading>
      <Text>{data.notebook.content}</Text>
      <Text mt={4} color="gray.500">Created at: {new Date(data.notebook.createdAt).toLocaleString()}</Text>
      <Text mt={2} color="gray.500">Updated at: {new Date(data.notebook.updatedAt).toLocaleString()}</Text>
    </Box>
  );
};

export default NotebookDetail;