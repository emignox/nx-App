import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, VStack, Flex } from '@chakra-ui/react';
import { useMutation, ApolloClient } from '@apollo/client';
import { gql } from 'graphql-tag';
import { GET_USER_NOTEBOOKS } from '../querys/queryGetNote';
import  GetNotes from '../components/getNotes';

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

interface CreateNotebookFormProps {
  client: ApolloClient<object>;
}

const CreateNotebookForm: React.FC<CreateNotebookFormProps> = ({ client }) => {
  const [formState, setFormState] = useState({ title: '', content: '' });
  const toast = useToast();

  const [createNotebook, { loading }] = useMutation(CREATE_NOTEBOOK_MUTATION, {
    onCompleted: (data) => {
      const newNotebook = data.createNotebook;

      // Read existing notebooks from cache
      const existingNotebooks = client.readQuery({ query: GET_USER_NOTEBOOKS });

      // If there are existing notebooks, update the cache
      if (existingNotebooks?.getUserNotebooks) {
        client.writeQuery({
          query: GET_USER_NOTEBOOKS,
          data: {
            getUserNotebooks: [...existingNotebooks.getUserNotebooks, newNotebook],
          },
        });
      }

      toast({
        title: "Notebook created.",
        description: `Your notebook "${newNotebook.title}" has been created!`,
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
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNotebook({ variables: { input: formState } });
  };

  return (
    <>
    <Box  width="100%" display={'flex'}>
    
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="2xl"
          maxW="400px"
          w="full"
          transition="all 0.3s ease"
          _hover={{ boxShadow: "lg" }}
          height={"40%"}
          position={"fixed"}
          top={"20%"}
        >
          <Heading
            as="h1"
            size="lg"
            textAlign="center"
            mb={6}
            fontWeight="bold"
            color="teal.600"
          >
            Create Notebook
          </Heading>
          <VStack spacing={4}>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl id="title" isRequired>
                <FormLabel fontSize="md" fontWeight="medium" color="gray.700">
                  Title
                </FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  placeholder="Notebook title"
                  bg="gray.50"
                  borderRadius="md"
                  size="md"
                />
              </FormControl>
              <FormControl id="content" isRequired>
                <FormLabel fontSize="md" fontWeight="medium" color="gray.700">
                  Content
                </FormLabel>
                <Input
                  type="text"
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  placeholder="Notebook content"
                  bg="gray.50"
                  borderRadius="md"
                  size="md"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                mt={4}
                isLoading={loading}
                size="md"
                fontWeight="medium"
                borderRadius="md"
              >
                Create Notebook
              </Button>
            </form>
          </VStack>
        </Box>
     <GetNotes />
   </Box>

   </>
  );
};


export default CreateNotebookForm;
