import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from "./keycloak"

createRoot(document.getElementById('root')!).render(
    <ReactKeycloakProvider authClient={keycloak}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </ReactKeycloakProvider>
)
