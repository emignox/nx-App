import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, VStack, Flex } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import GetQuerys from "../components/getNotes"

 export const CREATE_NOTEBOOK_MUTATION = gql`
  mutation CreateNotebook($input: CreateNotebookInput!) {
    createNotebook(createNotebookInput: $input) {
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

const CreateNotebookForm = () => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
  });

  const toast = useToast();
  const [createNotebook, { loading }] = useMutation(CREATE_NOTEBOOK_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Notebook created.",
        description: `Your notebook "${data.createNotebook.title}" has been created!`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating notebook.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNotebook({ variables: { input: formState } });
  };

  return (
    <Flex 
      direction="column"
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="400px"
        w="full"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6} fontWeight="semibold" color="teal.500">
          Create Notebook
        </Heading>
        <VStack spacing={4}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormControl id="title" isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleChange}
                focusBorderColor="teal.400"
                placeholder="Notebook title"
                bg="gray.50"
                borderRadius="md"
                size="lg"
              />
            </FormControl>
            <FormControl id="content" isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Content</FormLabel>
              <Input
                type="text"
                name="content"
                value={formState.content}
                onChange={handleChange}
                focusBorderColor="teal.400"
                placeholder="Notebook content"
                bg="gray.50"
                borderRadius="md"
                size="lg"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              mt={4}
              isLoading={loading}
              size="lg"
              fontWeight="medium"
              borderRadius="md"
            >
              Create Notebook
            </Button>
          </form>
        </VStack>
      </Box>
      <GetQuerys />  
    </Flex>
  );
};

export default CreateNotebookForm;
