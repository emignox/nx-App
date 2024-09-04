import { Box, Flex } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { Heading,Link } from "@chakra-ui/react";


function Menu(){
    return (
        <Box display={'flex'} justifyContent={'space-between'}  boxShadow={'dark-lg'} p={3} bg={'gray.100'}  >
            <Link href="/my-notes"  >
            <Heading as="h1" size="xl" color="teal.500" fontFamily={'Nerko One, cursive'} >
            E-note...
            </Heading>
            </Link>
            <Link href="/pro" >
            <CgProfile size={40} color="teal.500" />
            </Link>
        </Box>
    )
}

export default Menu;
