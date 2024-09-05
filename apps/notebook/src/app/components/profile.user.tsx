import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_BY_ID } from '../querys/getUserData';
import { UPDATE_USER_INFO_MUTATION } from '../querys/updateUser';
import { Box, Heading, Text, Spinner, Flex, VStack, Avatar, Divider, Input, Button } from '@chakra-ui/react';

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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [updateUserInfo, { loading: updateLoading }] = useMutation(UPDATE_USER_INFO_MUTATION, {
    onCompleted: (data) => {
      setName(data.updateUserInfo.name);
      setEmail(data.updateUserInfo.email);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    }
  });

 
  const handleUpdate = () => {
    updateUserInfo({
      variables: {
        updateUserInput: {
          id: data?.getUserById._id,
          name,
          email,
        },
      },
    });
  };
  
  useEffect(() => {
    if (data) {
      setName(data.getUserById.name);
      setEmail(data.getUserById.email);
    }
  }, [data]);

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
          {getUserById.name.charAt(0).toUpperCase() + getUserById.name.slice(1)}
        </Heading>
        <Text fontSize="md" color="gray.600" mb={4}>
          {getUserById.email}
        </Text>
        <Divider mb={4} />

        {/* Form per aggiornare il profilo utente */}
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Update Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Update Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            colorScheme="teal"
            isLoading={updateLoading}
            onClick={handleUpdate}
          >
            Update Profile
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default UserProfile;
