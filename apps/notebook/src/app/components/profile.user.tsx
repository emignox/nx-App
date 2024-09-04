import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../querys/getUserData'; // Assume you have this query in a separate file
import { Box, Heading, Text, Spinner, Flex, VStack, Avatar, Divider } from '@chakra-ui/react';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUserByIdData {
  getUserById: User;
}

interface GetUserByIdVars {
  id: string;
}

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const { loading, error, data } = useQuery<GetUserByIdData, GetUserByIdVars>(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) return (
    <Flex align="center" justify="center" height="100vh" bg="gray.100">
      <Spinner size="xl" color="teal.500" />
    </Flex>
  );

  if (error) return (
    <Flex align="center" justify="center" height="100vh" bg="gray.100">
      <Text color="red.500">Error: {error.message}</Text>
    </Flex>
  );

  const { getUserById } = data!;

  return (
    <Flex direction="column" align="center" justify="center" height="100vh" bg="gray.100" px={4}>
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        maxW="400px"
        w="full"
        textAlign="center"
      >
        <Avatar name={getUserById.name} size="2xl" mb={4} />
        <Heading as="h2" size="lg" color="teal.500" mb={2}>
          {getUserById.name}
        </Heading>
        <Text fontSize="md" color="gray.600" mb={4}>
          {getUserById.email}
        </Text>
        <Divider />
      </Box>
    </Flex>
  );
};

export default UserProfile;
