import React, { useState, useEffect } from 'react';
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Navigation from './Navigation';
import CrearCategoriaModal from './categorias/CrearCategoriaModal';
import CrearProductoModal from './productos/CrearProductoModal';
import CrearIngredienteModal from './ingredientes/CrearIngredienteModal';
import axios from 'axios';

const App = () => {
  const [showProductos, setShowProductos] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showIngredientes, setShowIngredientes] = useState(false);
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [showCrearIngrediente, setShowCrearIngrediente] = useState(false);
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

  const handleButtonClick = () => {
    // Activa siempre Productos, sin conmutar
    setShowProductos(true);
  
    // Asegúrate de que las demás secciones estén desactivadas
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
  };
  

  const handleCategoryClick = () => {
    // Siempre deja showCategorias en true
    setShowCategorias(true);
  
    // Cierra las demás vistas
    setShowProductos(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
  };
  
  const handleIngredienteClick = () => {
    // Siempre deja showIngredientes en true
    setShowIngredientes(true);
  
    // Cierra las demás vistas
    setShowProductos(false);
    setShowCategorias(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
  };

  const handleCrearCategoriaClick = () => {
    setShowCrearCategoria(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
  };

  const handleCrearProductoClick = () => {
    setShowCrearProducto(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearIngrediente(false);
  };

  const handleCrearIngredienteClick = () => {
    setShowCrearIngrediente(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setIngredienteEdit(null);
  };

  const addCategoria = (categoria) => {
    setCategorias([...categorias, categoria]);
  };

  const addIngrediente = (ingrediente) => {
    setIngredientes([...ingredientes, ingrediente]);
  };

  return (
    <div className="flex w-full">
      {/* Navigation es fixed dentro de su propio componente,
          así que el contenido a la derecha necesita margin-left */}
      <Navigation
        handleButtonClick={handleButtonClick}
        handleCategoryClick={handleCategoryClick}
        handleIngredienteClick={handleIngredienteClick}
        handleCrearCategoriaClick={handleCrearCategoriaClick}
        handleCrearProductoClick={handleCrearProductoClick}
        handleCrearIngredienteClick={handleCrearIngredienteClick}
      />

      {/* Contenedor principal (lo que antes era mainContainer) */}
      <div className="ml-[200px] w-full flex-1 h-auto overflow-y-auto">
        {/* Contenido interno (lo que antes era contentContainer) */}
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Mi Tienda</h1>

          {showProductos && (
            <ListaProductos categorias={categorias} />
          )}
          {showCategorias && (
            <Categorias
              categorias={categorias}
              handleCrearCategoriaClick={handleCrearCategoriaClick}
            />
          )}
          {showIngredientes && (
            <Ingredientes ingredientes={ingredientes} />
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
        </div>
      </div>
    </div>
  );
};

export default App;
