import React, { useState, useEffect } from 'react';
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Navigation from './Navigation';
import CrearCategoriaModal from './categorias/CrearCategoriaModal';
import CrearProductoModal from './productos/CrearProductoModal';
import CrearIngredienteModal from './ingredientes/CrearIngredienteModal';
import axios from 'axios';
import CrearUsuario from './components/Users/CrearUsuario'; // Importa el componente

const App = () => {
  // Estados para las secciones
  const [showProductos, setShowProductos] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showIngredientes, setShowIngredientes] = useState(false);
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [showCrearIngrediente, setShowCrearIngrediente] = useState(false);
  const [showCrearUsuario, setShowCrearUsuario] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteEdit, setIngredienteEdit] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/server/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/server/ingredientes');
        setIngredientes(response.data);
      } catch (error) {
        console.error('Error al cargar los ingredientes:', error);
      }
    };
    fetchIngredientes();
  }, []);

  // Función para ocultar todas las secciones
  const hideAllSections = () => {
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowCrearUsuario(false);
  };

  // Funciones para manejar los clics en cada botón
  const handleButtonClick = () => {
    hideAllSections();
    setShowProductos(true);
  };

  const handleCategoryClick = () => {
    hideAllSections();
    setShowCategorias(true);
  };

  const handleIngredienteClick = () => {
    hideAllSections();
    setShowIngredientes(true);
  };

  const handleCrearCategoriaClick = () => {
    hideAllSections();
    setShowCrearCategoria(true);
  };

  const handleCrearProductoClick = () => {
    hideAllSections();
    setShowCrearProducto(true);
  };

  const handleCrearIngredienteClick = () => {
    hideAllSections();
    setShowCrearIngrediente(true);
    setIngredienteEdit(null);
  };

  const handleCrearUsuarioClick = () => {
    hideAllSections();
    setShowCrearUsuario(true);
  };

  const addCategoria = (categoria) => {
    setCategorias([...categorias, categoria]);
  };

  const addIngrediente = (ingrediente) => {
    setIngredientes([...ingredientes, ingrediente]);
  };

  return (
    <div className="flex w-full">
      <Navigation
        handleButtonClick={handleButtonClick}
        handleCategoryClick={handleCategoryClick}
        handleIngredienteClick={handleIngredienteClick}
        handleCrearCategoriaClick={handleCrearCategoriaClick}
        handleCrearProductoClick={handleCrearProductoClick}
        handleCrearIngredienteClick={handleCrearIngredienteClick}
        handleCrearUsuarioClick={handleCrearUsuarioClick}
      />

      <div className="ml-[200px] w-full flex-1 h-auto overflow-y-auto">
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Mi Tienda</h1>
          
          {/* Panel de Opciones: botones cuadrados en una parrilla */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleButtonClick}
            >
              Productos
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleCategoryClick}
            >
              Categorías
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleIngredienteClick}
            >
              Ingredientes
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleCrearCategoriaClick}
            >
              Crear Categoría
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleCrearProductoClick}
            >
              Crear Producto
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleCrearIngredienteClick}
            >
              Crear Ingrediente
            </button>
            <button 
              className="flex items-center justify-center border w-40 h-40"
              onClick={handleCrearUsuarioClick}
            >
              Crear Usuario
            </button>
          </div>

          {/* Renderizado condicional de secciones */}
          {showProductos && (
            <div className="p-4 border">
              <p>Contenido de Productos</p>
              <ListaProductos categorias={categorias} />
            </div>
          )}
          {showCategorias && (
            <div className="p-4 border">
              <p>Contenido de Categorías</p>
              <Categorias
                categorias={categorias}
                handleCrearCategoriaClick={handleCrearCategoriaClick}
              />
            </div>
          )}
          {showIngredientes && (
            <div className="p-4 border">
              <p>Contenido de Ingredientes</p>
              <Ingredientes ingredientes={ingredientes} />
            </div>
          )}
          {showCrearCategoria && (
            <CrearCategoriaModal
              handleCloseModal={() => setShowCrearCategoria(false)}
              addCategoria={addCategoria}
            />
          )}
          {showCrearProducto && (
            <CrearProductoModal
              handleCloseModal={() => setShowCrearProducto(false)}
              categorias={categorias}
            />
          )}
          {showCrearIngrediente && (
            <CrearIngredienteModal
              handleCloseModal={() => setShowCrearIngrediente(false)}
              ingredienteEdit={ingredienteEdit}
              addIngrediente={addIngrediente}
            />
          )}
          {showCrearUsuario && (
            <CrearUsuario 
              handleCloseModal={() => setShowCrearUsuario(false)}
              addUsuario={(nuevoUsuario) => {
                console.log("Usuario creado:", nuevoUsuario);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
