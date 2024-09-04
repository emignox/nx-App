import { Flex } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { Heading } from "@chakra-ui/react";



function Menu(){
    return (
        <Flex display={'flex'} justifyContent={'space-between'}  align={'center'} p={3} bg={'gray.100'} >
        
            <Heading as="h1" size="xl" color="teal.500" fontFamily={'Nerko One, cursive'} >
            E-note...
            </Heading>
            <CgProfile size={40} color="teal.500" />
        </Flex>
    )
}

export default Menu;
