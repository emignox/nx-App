import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { Box, Heading, Text, Spinner, VStack, Link as ChakraLink, IconButton } from '@chakra-ui/react';
import { gql } from 'graphql-tag';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

interface UserNotebooksProps {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
  };
}

export const GET_USER_NOTEBOOKS = gql`
  query GetUserNotebooks {
    getUserNotebooks {
      _id
      title
      content
      createdAt
      updatedAt
      user {
        _id
      }
    }
  }
`;

export const NOTEBOOK_CREATED_SUBSCRIPTION = gql`
  subscription OnNotebookCreated {
    notebookCreated {
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

const DELETE_NOTEBOOK_MUTATION = gql`
  mutation DeleteNotebook($id: String!) {
    deleteNotebook(id: $id)
  }
`;

const UserNotebooks = () => {
  const { loading, error, data, client } = useQuery(GET_USER_NOTEBOOKS);

const [deleteNotebook] = useMutation(DELETE_NOTEBOOK_MUTATION, {
  update(cache, { data: { deleteNotebook } }, { variables }) {
    if (deleteNotebook) {
      const existingNotebooks: { getUserNotebooks: UserNotebooksProps[] } | null = cache.readQuery({ query: GET_USER_NOTEBOOKS });

      if (existingNotebooks?.getUserNotebooks) {
        const updatedNotebooks = existingNotebooks.getUserNotebooks.filter(
          (notebook: UserNotebooksProps) => notebook._id !== variables?.id
        );

        cache.writeQuery({
          query: GET_USER_NOTEBOOKS,
          data: {
            getUserNotebooks: updatedNotebooks,
          },
        });
      }
    }
  },
});

  const { data: subscriptionData } = useSubscription(NOTEBOOK_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData) {
        const newNotebook = subscriptionData.data.notebookCreated;

        const existingNotebooks = client.readQuery({ query: GET_USER_NOTEBOOKS });

        if (existingNotebooks?.getUserNotebooks) {
          client.writeQuery({
            query: GET_USER_NOTEBOOKS,
            data: {
              getUserNotebooks: [...existingNotebooks.getUserNotebooks, newNotebook],
            },
          });
        }
      }
    },
  });

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  const handleDelete = async (id: string) => {
    await deleteNotebook({ variables: { id } });
  };

  const reversedData = data?.getUserNotebooks?.slice().reverse();

  return (
    <VStack  spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Heading as="h2" size="xl" textAlign="center" color={"teal"} >
        My Notebooks
      </Heading>
      {reversedData && reversedData.length > 0 ? (
        reversedData.map((notebook: UserNotebooksProps) => (
          <Box
            key={notebook._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            _hover={{ bg: "teal.50" }}
            position="relative"
          >
            <Heading fontSize="xl" color={"teal"} >
              <ChakraLink as={Link} to={`/note/${notebook._id}`}>
                {notebook.title}
              </ChakraLink>
            </Heading>
            <Text mt={4}>{notebook.content}</Text>
            <Box display={'flex'} justifyContent={'space-between'}>
            <Text mt={4} fontSize="sm" color="gray.500">
              Created at: {new Date(notebook.createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.500">
            </Text>
            <IconButton
              aria-label="Delete Notebook"
              icon={<FaTrash />}
              colorScheme="red"
              onClick={() => handleDelete(notebook._id)}
            />
            </Box>
          </Box>
        ))
      ) : (
        <Text>No notebooks found.</Text>
      )}
    </VStack>
    
  );
};

export default UserNotebooks;
