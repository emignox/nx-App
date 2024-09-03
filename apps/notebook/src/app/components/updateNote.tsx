import React, { useState } from 'react'
import { useMutation, useQuery,useSubscription } from '@apollo/client'
import {Box,Button,FormControl,FormLabel,Input,Spinner,Textarea, VStack, Heading, Text, Alert } from '@chakra-ui/react'
import {gql} from 'graphql-tag'
import { useParams } from 'react-router-dom'
import {GET_USER_NOTEBOOK_BY_ID} from '../querys/getNoteById'
import {UPDATE_NOTEBOOK_MUTATION,NOTEBOOK_UPDATED_SUBSCRIPTION} from '../querys/querys.update'





    const UpdateNotebookForm = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
  const [formState, setFormState] = useState({ title: '', content: '' });

  const { loading, error, data } = useQuery(GET_USER_NOTEBOOK_BY_ID, {
    variables: { id },
    onCompleted: (data) => {
      setFormState({ title: data.getUserNotebook.title, content: data.getUserNotebook.content });
    },
  });


const [updateNotebook] = useMutation(UPDATE_NOTEBOOK_MUTATION)

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

  if (loading) return <Spinner size="xl" />;
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
    <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Box as="form" onSubmit={handleSubmit} p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50">
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Enter notebook title"
          />
        </FormControl>
        <FormControl id="content" isRequired mt={4}>
          <FormLabel>Content</FormLabel>
          <Textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            placeholder="Enter notebook content"
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" mt={4}>
          Update Notebook
        </Button>
      </Box>
    </VStack>
  );
};

export default UpdateNotebookForm;
