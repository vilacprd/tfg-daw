import React, { useState, useEffect } from 'react';
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Navigation from './Navigation';
import CrearCategoriaModal from './categorias/CrearCategoriaModal';
import CrearProductoModal from './productos/CrearProductoModal';
import CrearIngredienteModal from './ingredientes/CrearIngredienteModal';
import Comandas from './comandas/Comandas';
import ComandaDetails from './comandas/ComandaDetails';
import axios from 'axios';

const App = () => {
  const [showProductos, setShowProductos] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showIngredientes, setShowIngredientes] = useState(false);
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [showCrearIngrediente, setShowCrearIngrediente] = useState(false);
  const [showComandas, setShowComandas] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState(null);
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
    setShowProductos(true);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleCategoryClick = () => {
    setShowCategorias(true);
    setShowProductos(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleIngredienteClick = () => {
    setShowIngredientes(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleCrearCategoriaClick = () => {
    setShowCrearCategoria(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleCrearProductoClick = () => {
    setShowCrearProducto(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearIngrediente(false);
    setShowComandas(false);
    setSelectedComanda(null);
  };

  const handleCrearIngredienteClick = () => {
    setShowCrearIngrediente(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowComandas(false);
    setSelectedComanda(null);
    setIngredienteEdit(null);
  };

  const handleComandasClick = () => {
    setShowComandas(true);
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setSelectedComanda(null);
  };

  const handleComandaClick = (comanda) => {
    setSelectedComanda(comanda);
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
        handleComandasClick={handleComandasClick}
      />

      <div className="ml-[200px] w-full flex-1 h-auto overflow-y-auto">
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Mi Tienda</h1>

          {selectedComanda ? (
            <ComandaDetails comanda={selectedComanda} onBack={() => setSelectedComanda(null)} />
          ) : (
            <>
              {showProductos && <ListaProductos categorias={categorias} />}
              {showCategorias && (
                <Categorias
                  categorias={categorias}
                  handleCrearCategoriaClick={handleCrearCategoriaClick}
                />
              )}
              {showIngredientes && <Ingredientes ingredientes={ingredientes} />}
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
              {showComandas && <Comandas onComandaClick={handleComandaClick} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
