import React from 'react';
import { useQuery } from '@apollo/client';
import { Box, Heading, Text, Spinner, VStack } from '@chakra-ui/react';
import { GET_USER_NOTEBOOKS } from '../querys/queryGetNote';

interface Notebook {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
const UserNotebooks = () => {
  const { loading, error, data } = useQuery<{ getUserNotebooks: Notebook[] }>(GET_USER_NOTEBOOKS);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  return (
    <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Heading as="h2" size="xl" textAlign="center">
        My Notebooks
      </Heading>
      {data?.getUserNotebooks.length === 0 ? (
        <Text>No notebooks found.</Text>
      ) : (
        data?.getUserNotebooks.map((notebook) => (
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
      )}
    </VStack>
  );
};

export default UserNotebooks;
