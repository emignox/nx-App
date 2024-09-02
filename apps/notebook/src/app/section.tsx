import React from 'react';
import { Box, Heading, Text, List, ListItem, VStack, Tag } from '@chakra-ui/react';

type SectionItems = 
  | string
  | string[]
  | { [key: string]: string | string[] };

interface SectionProps {
  title: string;
  items: SectionItems;
}

const Section: React.FC<SectionProps> = ({ title, items }) => {
  return (
    <Box width="100%">
      <Heading as="h2" size="xl" marginBottom="4">
        {title}
      </Heading>
      {typeof items === 'object' && items !== null ? (
        Array.isArray(items) ? (
          <List spacing={2}>
            {items.map((item, index) => (
              <ListItem key={index}>
                <Tag colorScheme="teal">{item}</Tag>
              </ListItem>
            ))}
          </List>
        ) : (
          <VStack spacing={4} align="start">
            {Object.entries(items).map(([key, value]) => (
              <Box key={key}>
                <Text fontWeight="bold" marginBottom="2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                {typeof value === 'string' ? (
                  <Text>{value}</Text>
                ) : Array.isArray(value) ? (
                  <List spacing={2}>
                    {value.map((item, index) => (
                      <ListItem key={index}>
                        <Tag colorScheme="teal">{item}</Tag>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text>No data available</Text>
                )}
              </Box>
            ))}
          </VStack>
        )
      ) : (
        <Text>No data available</Text>
      )}
    </Box>
  );
};

export default Section;