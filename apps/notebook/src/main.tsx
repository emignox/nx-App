import ReactDOM from 'react-dom/client'; // Importa da 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './app/app';
import client from './app/apollo.client';

// Trova il nodo DOM in cui vuoi rendere il tuo React App
const rootElement = document.getElementById('root');

// Verifica se il nodo DOM è presente
if (rootElement) {
  // Crea una root con il nuovo API
  const root = ReactDOM.createRoot(rootElement);
  
  // Renderizza l'app
  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
} else {
  console.error('No root element found');
}