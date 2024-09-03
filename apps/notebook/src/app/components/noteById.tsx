import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { Box, Heading, Text, Spinner, VStack } from '@chakra-ui/react';
import { GET_USER_NOTEBOOK_BY_ID } from '../querys/getNoteById';
import  UpdateNote from './updateNote'

const NotebookDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params

  const { loading, error, data } = useQuery(GET_USER_NOTEBOOK_BY_ID, {
    variables: { id },
  });

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  const notebook = data?.getUserNotebook;

  return (
    <>
          <UpdateNote />
    <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
      <Heading as="h2" size="xl" textAlign="center">
        {notebook.title}
      </Heading>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50">
        <Text fontSize="lg">{notebook.content}</Text>
        <Text mt={4} fontSize="sm" color="gray.500">
          Created at: {new Date(notebook.createdAt).toLocaleString()}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Updated at: {new Date(notebook.updatedAt).toLocaleString()}
        </Text>
      </Box>
    </VStack>
    </>
  );
};

export default NotebookDetail;
