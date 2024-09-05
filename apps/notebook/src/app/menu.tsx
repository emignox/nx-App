import { Box, Link, Heading } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import React from "react";

function Menu() {
  // Controlla se il token è presente nel localStorage
  const token = localStorage.getItem("token");

  return (
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} bg={'teal.600'} p={3}>
      <Link
        href="/my-notes"
        _hover={{ textDecoration: 'none' }}  // Disabilita underline all'hover
        textDecoration="none"  // Disabilita underline di default
      >
        <Heading as="h1" size="xl" color="gray.100" fontFamily={"Bebas Neue, sans-serif"}>
          E-note...
        </Heading>
      </Link>
      {token ?(
        <Link

          href="/my-notes"
          _hover={{ textDecoration: 'none',color:"gray.50" }}  // Disabilita underline all'hover
          textDecoration="none"  // Disabilita underline di default
          color="gray.100"
          fontSize="2xl"
          transition={"all 0.3s ease-in-out"}
          
        >
           Create Note
        </Link>
      ): null}
      {/* Verifica se il token è presente: se sì, mostra il profilo; altrimenti mostra Login/Register */}
      {token ? (
        <Link
          href={token ? "/pro" : "/login"}
          _hover={{ textDecoration: 'none' }}  // Disabilita underline all'hover
          textDecoration="none"  // Disabilita underline di default
        >
          <CgProfile size={40} color="white" />
        </Link>
      ) : (
        <Link
          href="/login"
          _hover={{ textDecoration: 'none' }}  // Disabilita underline all'hover
          textDecoration="none"  // Disabilita underline di default
          color="teal.100"
          fontSize="lg"
        >
          Login / Register
        </Link>
      )}
    
    </Box>
  );
}

export default Menu;
