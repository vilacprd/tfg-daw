import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import App2 from './App2.jsx';
import { UserProvider } from './context/userContext.jsx';



createRoot(document.getElementById("root")).render(
  <UserProvider>
    <StrictMode>
      
      <App2 />
    </StrictMode>
  </UserProvider>
);
