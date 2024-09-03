import ReactDOM from 'react-dom/client'; // Importa da 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './app/app';
import client from './app/apollo.client';
import { ChakraProvider } from '@chakra-ui/react';
import "./index.css"

// Trova il nodo DOM in cui vuoi rendere il tuo React App
const rootElement = document.getElementById('root');

// Verifica se il nodo DOM è presente
if (rootElement) {
  // Crea una root con il nuovo API
  const root = ReactDOM.createRoot(rootElement);
  
  // Renderizza l'app
  root.render(
    <ChakraProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </ChakraProvider>
  );
} else {
  console.error('No root element found');
}