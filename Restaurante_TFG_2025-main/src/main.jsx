import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Login from './components/Login/Login.jsx'; // Asegúrate de importar Login

const Main = () => {
  const [usuario, setUsuario] = useState(null);

  // Verifica si hay un usuario guardado en localStorage al cargar la página
  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  // Función para cerrar sesión y limpiar localStorage
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <StrictMode>
      {usuario ? <App usuario={usuario} setUsuario={setUsuario} cerrarSesion={cerrarSesion} /> : <Login setUsuario={setUsuario} />}
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Main />);
