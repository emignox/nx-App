import {Stack , Box ,Image,Text,Heading,Button, keyframes}from "@chakra-ui/react"

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;
function Jumbo(){
    return(
        <>
        <Stack direction={{ base: 'column', md: 'row' }} align="center" justify="center" height={'60vh'}  spacing={{base:"50", md:"50"}} m={5} w={"95%"} py={10} px={5}>
        {/* Box for the image inside teal background */}
        <Box  p={10} borderRadius="md"
         _hover={{ borderRadius: "full"}} 
         transition="all 1s ease-in-out">
          <Box fontSize="150px" color="white" animation={`${float}`}>
            {/* React icon inside the Jumbotron */}
            <Image w={'500px'} src='/books1.png'>
                {/* Add your image here */}
              </Image>

          </Box>
        </Box>

        {/* Text outside of the teal box in black */}
        <Box textAlign="center" color="black">
          <Heading fontSize="6xl" mb={5}>
            Welcome<br/> to My Learning App!
          </Heading>
          <Text fontSize="lg">
            This app was created to learn  and practice the following technologies.
          </Text>
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
        </>
    )
}
export default Jumbo;