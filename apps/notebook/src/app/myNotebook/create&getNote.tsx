import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, VStack, Flex, Textarea } from '@chakra-ui/react';
import { useMutation, ApolloClient } from '@apollo/client';
import { gql } from 'graphql-tag';
import { GET_USER_NOTEBOOKS } from '../querys/queryGetNote';
import GetNotes from '../components/getNotes';

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

      const existingNotebooks = client.readQuery({ query: GET_USER_NOTEBOOKS });

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

      setFormState({ title: '', content: '' }); // Reset the form after submission
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNotebook({ variables: { input: formState } });
  };

  return (
    <Box
      bgGradient="linear(to-r, gray.900, gray.700)"
      minH="100vh"
      p={6}
    >
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        maxW={{ base: "90%", md: "80%", lg: "50%" }}
        mx="auto"
        pt={10}
      >
        <Box
          width="100%"
          bg="gray.800"
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          boxShadow="2xl"
        >
          <Heading color={'teal.300'} mb={4} textAlign="center">
            Create a Note
          </Heading>
          <VStack spacing={6}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormControl id="title" isRequired>
                <FormLabel
                  fontSize="lg"
                  fontWeight="medium"
                  color="gray.300"
                >
                  Title
                </FormLabel>
                <Input
                  textColor={'white'}
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  placeholder="Enter notebook title"
                  bg="gray.700"
                  borderRadius="md"
                  size="sm"
                  _hover={{ bg: "gray.600" }}
                  _focus={{ bg: "gray.600", borderColor: "teal.500" }}
                />
              </FormControl>
              <FormControl id="content" isRequired mt={4}>
                <FormLabel
                  fontSize="lg"
                  fontWeight="medium"
                  color="gray.300"
                >
                  Content
                </FormLabel>
                <Textarea
                  textColor={'white'}
                  name="content"
                  value={formState.content}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  placeholder="Enter notebook content"
                  bg="gray.700"
                  borderRadius="md"
                  size="sm"
                  rows={6}
                  _hover={{ bg: "gray.600" }}
                  _focus={{ bg: "gray.600", borderColor: "teal.500" }}
                />
              </FormControl>
              <Flex mt={6} justify="space-between">
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="sm"
                  fontWeight="bold"
                  borderRadius="md"
                  boxShadow="lg"
                  isLoading={loading}
                >
                  Create Notebook
                </Button>
              </Flex>
            </form>
          </VStack>
        </Box>
      </Flex>
      <GetNotes />

    </Box>
  );
};

export default CreateNotebookForm;
