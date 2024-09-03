import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, VStack, Flex,Link } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      _id
      name
      email
    }
  }
`;

const SignUpForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const toast = useToast();
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Account created.",
        description: `Welcome ${data.createUser.name}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating account.",
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
    createUser({ variables: { input: formState } });
  };

  return (
    <>
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
        <Heading as="h1" size="lg" textAlign="center"   mb={6} fontWeight="semibold" color="teal.500">
          Sign Up
        </Heading>
        <VStack spacing={4}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormControl id="name" isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                focusBorderColor="teal.400"
                placeholder="Your name"
                bg="gray.50"
                borderRadius="md"
                size="lg"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                focusBorderColor="teal.400"
                placeholder="Your email"
                bg="gray.50"
                borderRadius="md"
                size="lg"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                focusBorderColor="teal.400"
                placeholder="Your password"
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
              Create Account
            </Button>
            
          </form>
        </VStack>
        <Link href="/login" color="teal.500" mt={32}  >
              Already have an account? Login
            </Link>  
      </Box>
    </Flex>
    </>
  );
};

export default SignUpForm;
