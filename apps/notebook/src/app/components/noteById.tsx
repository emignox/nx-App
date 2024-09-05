import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { Box, Heading, Text, Spinner, VStack,Link } from '@chakra-ui/react';
import { GET_USER_NOTEBOOK_BY_ID } from '../querys/getNoteById';
import UpdateNote from './updateNote';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { IoIosBackspace } from "react-icons/io";

const NotebookDetail = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL params

  const { loading, error, data } = useQuery(GET_USER_NOTEBOOK_BY_ID, {
    variables: { id },
  });

  if (loading) return <Spinner size="xl" color="teal.300" />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  const notebook = data?.getUserNotebook;

  return (
    <>
     <Box
     bg={'gray.100'}
      width={"100%"}
      height={"100vh"}
    >
       <Link as={RouterLink} to={"/my-notes"} color={"teal.500"} display={'flex'} alignItems={'center'} p={4} >
        <IoIosBackspace size={30}  /> 
       </Link>
      <Heading textAlign={'center'} color={'teal.500'} as={'h1'} fontFamily={"Bebas Neue, sans-serif"}>
        Update your Note
      </Heading>
      <UpdateNote />
      <VStack spacing={4} align="stretch" maxW="3xl" mx="auto" mt={10} p={4}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" borderColor="gray.600">
        <Heading as="h3" size="lg" textAlign="left" color="teal.500" py={2} fontFamily={"Bebas Neue, sans-serif"}>
          {notebook.title}
        </Heading>
          <Text fontSize="lg" color="gray.900">
            {notebook.content}
          </Text>
          <Box display={'flex'}  alignItems={'center'} justifyContent={'space-between'}  pt={3}>
          <Text  fontSize="sm" color="gray.500">
            Created at: {new Date(notebook.createdAt).toLocaleString()}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Updated at: {new Date(notebook.updatedAt).toLocaleString()}
          </Text>
          </Box>
        </Box>
      </VStack>
      </Box>
    </>
  );
};

export default NotebookDetail;
