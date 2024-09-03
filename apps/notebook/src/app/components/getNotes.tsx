import React, { useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { Box, Heading, Text, Spinner, VStack } from '@chakra-ui/react';
import { gql } from 'graphql-tag';
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

const UserNotebooks = () => {
  const { loading, error, data, client } = useQuery(GET_USER_NOTEBOOKS);

  const { data: subscriptionData } = useSubscription(NOTEBOOK_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData) {
        const newNotebook = subscriptionData.data.notebookCreated;

        // Update the cache with the new notebook
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

  const reversedData = data?.getUserNotebooks?.slice().reverse();

  return (
    <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Heading as="h2" size="xl" textAlign="center">
        My Notebooks
      </Heading>
      {reversedData && reversedData.length > 0 ? (
        reversedData.map((notebook : UserNotebooksProps) => (
          <Box
            key={notebook._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            _hover={{ bg: "teal.50" }}
          >
            <Heading fontSize="xl">{notebook.title}</Heading>
            <Text mt={4}>{notebook.content}</Text>
            <Text mt={4} fontSize="sm" color="gray.500">
              Created at: {new Date(notebook.createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Updated at: {new Date(notebook.updatedAt).toLocaleString()}
            </Text>
          </Box>
        ))
      ) : (
        <Text>No notebooks found.</Text>
      )}
    </VStack>
  );
};

export default UserNotebooks;
