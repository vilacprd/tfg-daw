import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react'; // Icono de encendido/apagado
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Navigation from './Navigation';
import CrearCategoriaModal from './categorias/CrearCategoriaModal';
import CrearProductoModal from './productos/CrearProductoModal';
import CrearIngredienteModal from './ingredientes/CrearIngredienteModal';
import Usuarios from './Users/Usuarios'; // Ahora usa el nuevo componente de Usuarios
import Comandas from './comandas/Comandas';
import ComandaDetails from './comandas/ComandaDetails';
import axios from 'axios';
import Login from './components/Login/Login';

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showProductos, setShowProductos] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showIngredientes, setShowIngredientes] = useState(false);
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [showCrearIngrediente, setShowCrearIngrediente] = useState(false);
  const [showUsuarios, setShowUsuarios] = useState(false);
  const [showComandas, setShowComandas] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteEdit, setIngredienteEdit] = useState(null);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario && storedUsuario !== "null") {
      try {
        setUsuario(JSON.parse(storedUsuario));
      } catch (e) {
        console.error("ERROR: No se pudo parsear el usuario almacenado", e);
      }
    }
  }, []);

  if (!usuario) {
    return <Login setUsuario={setUsuario} />;
  }

  const formattedID = usuario.id ? usuario.id.toString().padStart(5, '0') : '-----';

  // Función para ocultar todas las secciones
  const hideAllSections = () => {
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowUsuarios(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleProductos = () => { hideAllSections(); setShowProductos(true); };
  const handleCategorias = () => { hideAllSections(); setShowCategorias(true); };
  const handleIngredientes = () => { hideAllSections(); setShowIngredientes(true); };
  const handleCrearCategoria = () => { hideAllSections(); setShowCrearCategoria(true); };
  const handleCrearProducto = () => { hideAllSections(); setShowCrearProducto(true); };
  const handleCrearIngrediente = () => { hideAllSections(); setShowCrearIngrediente(true); setIngredienteEdit(null); };
  const handleComandasClick = () => { hideAllSections(); setShowComandas(true); };
  const handleComandaClick = (comanda) => { setSelectedComanda(comanda); };
  const handleUsuariosClick = () => { hideAllSections(); setShowUsuarios(true); };

  const addCategoria = (categoria) => { setCategorias([...categorias, categoria]); };
  const addIngrediente = (ingrediente) => { setIngredientes([...ingredientes, ingrediente]); };

  const handleLogout = () => {
    console.log("DEBUG: Cerrando sesión");
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
  
    // 🔹 Restablecer todos los estados al cerrar sesión
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowCrearUsuario(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };
  

  const botonesPorRol = {
    admin: [
      { label: 'Productos', action: handleProductos },
      { label: 'Categorías', action: handleCategorias },
      { label: 'Ingredientes', action: handleIngredientes },
      { label: 'Crear Categoría', action: handleCrearCategoria },
      { label: 'Crear Producto', action: handleCrearProducto },
      { label: 'Crear Ingrediente', action: handleCrearIngrediente },
      { label: 'Usuarios', action: handleUsuariosClick },
      { label: 'Comandas', action: handleComandasClick },
    ],
    encargado: [
      { label: 'Productos', action: handleProductos },
      { label: 'Categorías', action: handleCategorias },
      { label: 'Ingredientes', action: handleIngredientes },
      { label: 'Crear Categoría', action: handleCrearCategoria },
      { label: 'Crear Producto', action: handleCrearProducto },
      { label: 'Crear Ingrediente', action: handleCrearIngrediente },
      { label: 'Comandas', action: handleComandasClick },
    ],
    camarero: [
      { label: 'Productos', action: handleProductos },
      { label: 'Categorías', action: handleCategorias },
      { label: 'Ingredientes', action: handleIngredientes },
      { label: 'Crear Categoría', action: handleCrearCategoria },
      { label: 'Crear Producto', action: handleCrearProducto },
      { label: 'Crear Ingrediente', action: handleCrearIngrediente },
    ],
  };

  return (
    <div className="flex h-screen w-full">
      <Navigation
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        usuario={usuario}
        handleButtonClick={handleProductos}
        handleCategoryClick={handleCategorias}
        handleIngredienteClick={handleIngredientes}
        handleComandasClick={handleComandasClick}
        handleUsuariosClick={handleUsuariosClick}
      />
      <div className="ml-[200px] w-full flex-1 h-auto overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Bienvenid@ {usuario.nombre} - {usuario.rol}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Power className="mr-2" /> Cerrar sesión
            </button>
          </div>
          <p className="text-gray-600 mb-6">Nº de empleado: {formattedID}</p>

          {selectedComanda ? (
            <ComandaDetails
              comanda={selectedComanda}
              onBack={() => setSelectedComanda(null)}
            />
          ) : (
            <>
              {showProductos && <ListaProductos categorias={categorias} />}
              {showCategorias && <Categorias categorias={categorias} />}
              {showIngredientes && <Ingredientes ingredientes={ingredientes} />}
              {showCrearCategoria && <CrearCategoriaModal handleCloseModal={() => setShowCrearCategoria(false)} addCategoria={addCategoria} />}
              {showCrearProducto && <CrearProductoModal handleCloseModal={() => setShowCrearProducto(false)} categorias={categorias} />}
              {showCrearIngrediente && <CrearIngredienteModal handleCloseModal={() => setShowCrearIngrediente(false)} ingredienteEdit={ingredienteEdit} addIngrediente={addIngrediente} />}
              {showUsuarios && <Usuarios />}
              {showComandas && <Comandas onComandaClick={handleComandaClick} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
