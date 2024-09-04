import React, { useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { Box, Button, FormControl, FormLabel, Input, Spinner, Textarea, VStack, Text } from '@chakra-ui/react';
import { gql } from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { GET_USER_NOTEBOOK_BY_ID } from '../querys/getNoteById';
import { UPDATE_NOTEBOOK_MUTATION, NOTEBOOK_UPDATED_SUBSCRIPTION } from '../querys/querys.update';

const UpdateNotebookForm = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
  const [formState, setFormState] = useState({ title: '', content: '' });

  const { loading, error, data } = useQuery(GET_USER_NOTEBOOK_BY_ID, {
    variables: { id },
    onCompleted: (data) => {
      setFormState({ title: data.getUserNotebook.title, content: data.getUserNotebook.content });
    },
  });

  const [updateNotebook] = useMutation(UPDATE_NOTEBOOK_MUTATION);

  const { data: subscriptionData } = useSubscription(NOTEBOOK_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData) {
        setFormState({
          title: subscriptionData.data.notebookUpdated.title,
          content: subscriptionData.data.notebookUpdated.content,
        });
      }
    },
  });

  if (loading) return <Spinner size="xl" color="teal.300" />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateNotebook({
      variables: {
        id, // Pass the id as a separate variable
        updateNotebookInput: {
          ...formState, // Spread the existing formState fields (title and content)
          id, // Include the id field
        },
      },
    });
  };

  return (
    <Box
    bg={'gray.100'}
    width={"100%"}
    p={4}
  >
    <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        bg="gray.50"
        borderColor="gray.600"
      >
        <FormControl id="title" isRequired>
          <FormLabel color="gray.300">Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Enter notebook title"
            bg="gray.50"
            color="gray.900"
            focusBorderColor="teal.400"
            size={"sm"}
          />
        </FormControl>
        <FormControl id="content" isRequired mt={4}>
          <FormLabel color="gray.300">Content</FormLabel>
          <Textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            placeholder="Enter notebook content"
            bg="gray.50"
            color="gray.900"
            focusBorderColor="teal.400"
            size={'sm'}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" mt={4} size={"sm"}>
          Update Notebook
        </Button>
      </Box>
    </VStack>
    </Box>
  );
};

export default UpdateNotebookForm;
