import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { IconButton, useToast } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa'; // Importa l'icona del cestino

// Definisci la mutazione per eliminare una nota
const DELETE_NOTEBOOK = gql`
  mutation DeleteNotebook($id: String!) {
    deleteNotebook(id: $id)
  }
`;



const DeleteNotebookButton: React.FC<{ id: string; onDelete: () => void }> = ({ id, onDelete }) => {
  const [deleteNotebook, { loading, error }] = useMutation(DELETE_NOTEBOOK);
  const toast = useToast();

const handleDelete = async () => {
  try {
    await deleteNotebook({ variables: { id } });
    toast({
      title: 'Notebook deleted.',
      description: 'The notebook was successfully deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onDelete(); // Richiama la funzione per aggiornare lo stato della lista, se necessario
  } catch (e) {
    const error = e as Error
    toast({
      title: 'Error.',
      description: `An error occurred: ${error.message}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

  return (
    <IconButton
      icon={<FaTrash />}
      aria-label="Delete notebook"
      onClick={handleDelete}
      isLoading={loading}
      colorScheme="red"
      variant="outline"
    />
  );
};

export default DeleteNotebookButton;