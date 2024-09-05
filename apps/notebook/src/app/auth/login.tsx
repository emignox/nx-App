import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, VStack, Flex ,Link} from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($input: loginUserInput!) {
    loginUser(loginUserInput: $input)
  }
`;

const LoginForm = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const toast = useToast();
  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    onCompleted: (data) => {
      toast({
        title: "Login successful.",
        description: "You have been logged in successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        variant: "subtle",
      });
      localStorage.setItem('token', data.loginUser); // Salva il token nel localStorage
      // Puoi anche fare un redirect o aggiornare lo stato dell'applicazione qui

       navigate('/my-notes');
    },
    onError: (error) => {
      toast({
        title: "Error logging in.",
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
    loginUser({ variables: { input: formState } });
  };

  return (
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
        <Heading as="h1" size="lg" textAlign="center" mb={6} fontWeight="semibold" color="teal.500">
          Log In
        </Heading>
        <VStack spacing={4}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
              Log In
            </Button>
          </form>
        </VStack>
        <Link href="/register" color="teal.500"   >
              You don't have an account? Register
            </Link>  
      </Box>
 
    </Flex>
  );
};

export default LoginForm;
