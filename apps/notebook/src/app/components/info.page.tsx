import { Box, Button, Heading, Stack, Text, SimpleGrid, Card, CardBody,Image } from '@chakra-ui/react';
import React from 'react';
import { SiReact, SiTypescript, SiChakraui, SiNestjs,  SiGraphql, SiApollographql,SiMikrotik } from 'react-icons/si'; // Import delle icone
import Jumbo from './jumbotron';

interface Tech {
  name: string;
  icon: React.ReactNode;
}

const techs: Tech[] = [
  { name: 'React', icon: <SiReact size={40} color="#61DAFB" /> }, // Colore tipico di React
  { name: 'TypeScript', icon: <SiTypescript size={40} color="#3178C6" /> }, // Colore tipico di TypeScript
  { name: 'Chakra UI', icon: <SiChakraui size={40} color="#319795" /> }, // Colore tipico di Chakra UI
  { name: 'NestJS', icon: <SiNestjs size={40} color="#E0234E" /> }, // Colore tipico di NestJS
  { name: 'MikroORM', icon: <SiMikrotik size={40} color="#5C5556" /> }, // Icona di MikroORM
  { name: 'GraphQL', icon: <SiGraphql size={40} color="#E10098" /> }, // Colore tipico di GraphQL
  { name: 'Apollo Server', icon: <SiApollographql size={40} color="#311C87" /> }, // Colore tipico di Apollo Server
];

const HomePage: React.FC = () => {
  return (
    <Box bg="gray.100" display={'flex'} flexDir={'column'}  justifyContent={'center'} alignItems={'center'} minH="100vh" py={10}>
    <Jumbo />

    <Box my={280}>
      <Heading textAlign={'center'} color={"teal.500"} my={20} fontSize={"7xl"} fontFamily={"Bebas Neue, sans-serif"}>
        Tech used in this project
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} px={5} >
        {techs.map((tech) => (
          <Card key={tech.name} bg="gray.200" borderRadius="md" boxShadow="md" overflow="hidden" _hover={{transform:'scale(0.97)',        boxShadow: 'inset 0px 0px 15px rgba(49, 151, 149, 0.6)'}} transition={'all 0.3s '}>
            <CardBody display="flex" flexDirection="column" alignItems="center">
              <Box mb={5}>{tech.icon}</Box> {/* Display the icon */}
              <Heading fontSize="xl" mb={2}>
                {tech.name}
              </Heading>
              <Text textAlign="center">
                {`This app utilizes ${tech.name} to manage and build its structure.`}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      </Box>

      <Stack  direction={{ base: 'column', md: 'row-reverse' }} align="center" justify="center"  spacing={{base:"50", md:"10"}} m={5} w={"95%"} py={3} px={2} bg={'gray.200'} boxShadow={'md'} rounded={'md'}>
        {/* Box for the image inside teal background */}
        <Box  borderRadius="md"
         _hover={{ borderRadius: "full",
}} 
         transition="all 1s ease-in-out">
          <Box fontSize="150px" color="white">
            {/* React icon inside the Jumbotron */}
            <Image w={'900px'} src='/three-Photoroom.png'>
                {/* Add your image here */}
              </Image>

          </Box>
        </Box>

        {/* Text outside of the teal box in black */}
        <Box textAlign="center" color="black">
          <Heading fontSize="6xl" mb={5} fontFamily={"Bebas Neue, sans-serif"}>
            Keep Alive this<br/> Planet!
          </Heading>
          <Text fontSize="lg"  px={20} >
          Help prevent deforestation — every day, 
           an estimated 80,000 acres of forests are cut down, with millions of trees lost.
            By taking action, you can help protect these vital ecosystems and reduce the devastating impact on our planet.        </Text>
          <Button
            mt={5}
            bg={'teal.500'}
            size="md"
            _hover={{
              borderRadius: "full",
              bg: 'teal.300',
              color: 'gray.100',
            }}
            transition="all 1s ease-in-out"
            fontSize={"lg"}
            fontWeight="medium"
          >
            Learn More
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default HomePage;
