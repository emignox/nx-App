import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  Box, Heading, Text, Spinner, VStack, Link as ChakraLink, IconButton, Menu, MenuButton,
  MenuList, MenuItem, HStack, Badge
} from '@chakra-ui/react';
import { gql } from 'graphql-tag';
import { Link } from 'react-router-dom';
import { FaTrash, FaEllipsisV } from 'react-icons/fa';
import { GET_USER_NOTEBOOKS, NOTEBOOK_CREATED_SUBSCRIPTION, UserNotebooksProps } from '../querys/home.note';

const DELETE_NOTEBOOK_MUTATION = gql`
  mutation DeleteNotebook($id: String!) {
    deleteNotebook(id: $id)
  }
`;

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 giorni in millisecondi

const UserNotebooks = () => {
  const { loading, error, data, client } = useQuery(GET_USER_NOTEBOOKS);
  const [colorMap, setColorMap] = useState<{ [key: string]: { color: string; label: string; timestamp: number } }>({});

  // Recupera i badge dal localStorage all'inizio
useEffect(() => {
  const storedData = localStorage.getItem('colorMap');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const validData: { [key: string]: { color: string; label: string; timestamp: number } } = {};

    Object.keys(parsedData).forEach((id) => {
      const item = parsedData[id];
      if (Date.now() - item.timestamp < EXPIRATION_TIME) {
        validData[id] = item;
      }
    });

    setColorMap(validData);
  }
}, []);

  // Salva i badge nel localStorage ogni volta che colorMap cambia
  useEffect(() => {
    localStorage.setItem('colorMap', JSON.stringify(colorMap));
  }, [colorMap]);

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

  const handleColorSelect = (id: string, color: string, label: string) => {
    setColorMap((prev) => ({
      ...prev,
      [id]: { color, label, timestamp: Date.now() },
    }));
  };

  const reversedData = data?.getUserNotebooks?.slice().reverse();

  return (
    <VStack
      spacing={4}
      align="stretch"
      maxW={{ base: "90%", md: "80%", lg: "50%" }} // Matching the width of the form
      mx="auto"
      mt={10}
      p={4}
    >
      <Heading as="h2" size="xl" textAlign="center" color={"teal"}>
        My Notes
      </Heading>
      {reversedData && reversedData.length > 0 ? (
        reversedData.map((notebook: UserNotebooksProps) => {
          const selectedColor = colorMap[notebook._id]?.color || 'gray';
          const selectedLabel = colorMap[notebook._id]?.label || '';

          return (
            <Box
              bg="gray.100"
              key={notebook._id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.50", transition: "all 0.2s ease" }}
              position="relative"
              textColor="black"
            >
              <HStack justifyContent="space-between">
                <HStack>
                  <Box
                    as="span"
                    bg={selectedColor}
                    borderRadius="full"
                    boxSize="10px"
                    display="inline-block"
                  />
                  <Heading fontSize="xl" color={"teal"}>
                    <ChakraLink as={Link} to={`/note/${notebook._id}`}>
                      {notebook.title}
                    </ChakraLink>
                  </Heading>
                  {selectedLabel && (
                    <Badge colorScheme={selectedColor === 'red' ? 'red' : selectedColor === 'blue' ? 'blue' : 'yellow'}>
                      {selectedLabel}
                    </Badge>
                  )}
                </HStack>

                <Menu>
                  <MenuButton as={IconButton} icon={<FaEllipsisV />} />
                  <MenuList color={'black'}>
                    <MenuItem onClick={() => handleColorSelect(notebook._id, 'red', 'Urgent')}>
                      <Box as="span" bg="red.500" borderRadius="full" boxSize="10px" mr={2} />
                      Urgent
                    </MenuItem>
                    <MenuItem onClick={() => handleColorSelect(notebook._id, 'yellow', 'Work')}>
                      <Box as="span" bg="yellow.500" borderRadius="full" boxSize="10px" mr={2} />
                      Work
                    </MenuItem>
                    <MenuItem onClick={() => handleColorSelect(notebook._id, 'blue', 'Private Life')}>
                      <Box as="span" bg="blue.500" borderRadius="full" boxSize="10px" mr={2} />
                      Private Life
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              <Box display={'flex'} justifyContent={'space-between'} mt={4}>
                <Text fontSize="sm" color="gray.500">
                  Created at: {new Date(notebook.createdAt).toLocaleString()}
                </Text>
                <IconButton
                  aria-label="Delete Notebook"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleDelete(notebook._id)}
                />
              </Box>
            </Box>
          );
        })
      ) : (
        <Text>No notebooks found.</Text>
      )}
    </VStack>
  );
};

export default UserNotebooks;
