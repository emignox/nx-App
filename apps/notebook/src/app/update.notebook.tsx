import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Box, Heading, Input, Textarea, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { NotebookType } from '../../../../api/src/notebook/notebook.type';

const GET_NOTEBOOK_BY_ID = gql`
  query GetNotebookById($id: String!) {
    notebook(id: $id) {
      _id
      title
      content
    }
  }
`;

const UPDATE_NOTEBOOK = gql`
  mutation UpdateNotebook($id: String!, $title: String!, $content: String!) {
    updateNotebook(updateNotebookInput: { id: $id, title: $title, content: $content }) {
      _id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

interface UpdateNotebookFormProps {
  onClose: () => void;
}

const UpdateNotebookForm: React.FC<UpdateNotebookFormProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const { loading: queryLoading, error: queryError, data } = useQuery<{ notebook: NotebookType }>(GET_NOTEBOOK_BY_ID, {
    variables: { id },
  });

  const [updateNotebook, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_NOTEBOOK);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (data?.notebook) {
      setTitle(data.notebook.title ?? '');
      setContent(data.notebook.content ?? '');
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotebook({
        variables: { id: id!, title, content },
      });
      alert('Notebook updated successfully');
      onClose(); // Chiudi il modulo dopo l'aggiornamento
    } catch (err) {
      console.error(err);
    }
  };

  if (queryLoading) return <Spinner size="xl" />;
  if (queryError) return (
    <Alert status="error">
      <AlertIcon />
      Error: {queryError.message}
    </Alert>
  );

  return (
    <Box width="100%" maxWidth="800px" margin="0 auto" padding="20px" bg="white" borderRadius="md" boxShadow="md">
      <Heading as="h1" size="xl" marginBottom="4">Update Notebook</Heading>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={4}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          mb={4}
        />
        <Box display={'flex'} justifyContent={'space-between'}>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={mutationLoading}
        >
          Save Changes
        </Button>
        <Button
          type="button"
          colorScheme="blue"
          onClick={onClose}
        >
          Cancel
        </Button>
        </Box>
        {mutationError && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            Error: {mutationError.message}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default UpdateNotebookForm;