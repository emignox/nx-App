import { Box, Heading } from '@chakra-ui/react';
import Notebook from './notebooks.list';

const MyComponent: React.FC = () => {
  return (
    <>
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      textAlign={'center'}
      bg={"#B3E6DC"}
      margin={5}
      p={2}
      height="100px" // Assicurati di impostare un'altezza sufficiente
      rounded={"20"}
    >
      <Heading as="h1" size="xl" >
        My Notebook
      </Heading>
    </Box>
          <Notebook />
          </>

  );
};

export default MyComponent;