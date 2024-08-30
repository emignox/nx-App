import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Box, Button, Input, FormControl, FormLabel, Textarea, Alert, AlertIcon } from '@chakra-ui/react';

const CREATE_NOTEBOOK = gql`
  mutation CreateNotebook($input: CreateNotebookInput!) {
    createNotebook(createNotebookInput: $input) {
      _id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const CreateNotebook: React.FC<{ refetch: () => void }> = ({ refetch }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createNotebook, { loading, error, data }] = useMutation(CREATE_NOTEBOOK);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createNotebook({
        variables: {
          input: { title, content },
        },
      });
      setTitle('');
      setContent('');
      refetch(); // Chiamata refetch per aggiornare i dati
    } catch (err) {
      console.error('Error creating notebook:', err);
    }
  };

  return (
    <Box maxWidth="800px" margin="5" padding="20px" bg="white" borderRadius="md" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb="4">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>
        <FormControl id="content" mb="4">
          <FormLabel>Content</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
        >
          Create Note
        </Button>
        {error && (
          <Alert status="error" mt="4">
            <AlertIcon />
            Error: {error.message}
          </Alert>
        )}
        {data && !error && (
          <Alert status="success" mt="4">
            <AlertIcon />
            Notebook created successfully!
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default CreateNotebook;