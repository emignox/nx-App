import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Box, Heading, Text, List, ListItem, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { NotebookType } from "../../../../api/src/notebook/notebook.type";

const GET_NOTEBOOKS = gql`
  query GetNotebooks {
    notebooks {
      _id
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const NotebookListComponent: React.FC = () => {
  const { loading, error, data } = useQuery<{ notebooks: NotebookType[] }>(GET_NOTEBOOKS);

  if (loading) return <Spinner size="xl" />;
  if (error) return (
    <Alert status="error">
      <AlertIcon />
      Error: {error.message}
    </Alert>
  );

  return (
    <Box width="100%" maxWidth="800px" margin="0 auto" padding="20px" bg="white" borderRadius="md" boxShadow="md">
      <Heading as="h1" size="xl" marginBottom="4">Notebooks</Heading>
      <List spacing={4}>
        {data?.notebooks.map((notebook: NotebookType) => (
          <ListItem
            key={notebook._id}
            padding="4"
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            boxShadow="md"
          >
            <Heading as="h2" size="md" marginBottom="2">{notebook.title}</Heading>
            <Text>{notebook.content}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export function Notebook() {
  return (
    <div>
      <NotebookListComponent />
    </div>
  );
}

export default Notebook;