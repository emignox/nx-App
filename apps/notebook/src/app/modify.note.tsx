import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaPen } from 'react-icons/fa'; // Icona matita
import { useNavigate } from 'react-router-dom';

// Definisci le props per il componente
interface EditNotebookButtonProps {
  id: string; // ID della nota da modificare
}

// Componente funzionale
const EditNotebookButton: React.FC<EditNotebookButtonProps> = ({ id }) => {
  const navigate = useNavigate(); // Hook per la navigazione

  // Funzione che naviga alla pagina di dettaglio della nota


  return (
    <IconButton
      icon={<FaPen />} // Icona matita
      aria-label="Edit notebook"
      colorScheme="blue"
      variant="outline"
    />
  );
};

export default EditNotebookButton;