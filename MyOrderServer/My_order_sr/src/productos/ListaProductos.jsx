import React, { useState, useEffect } from 'react';
import { fetchProductos, deleteProducto, fetchCategorias } from '../connections';
import CrearProductoModal from './CrearProductoModal';
import Producto from './Producto';

const ListaProductos = ({ categorias = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoEdit, setProductoEdit] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductosData();
  }, []);

 
  useEffect(() => {
    if (!categorias.length) {
      fetchCategorias().then(data => {       
        console.log("Categorías:", data);
      }).catch(err => console.error(err));
    }
  }, []);
  
  const [categoriasState, setCategoriasState] = useState([]);

  useEffect(() => {
    const fetchCategoriasData = async () => {
      try {
        const response = await fetch('http://localhost:3000/server/categorias');
        const data = await response.json();
        setCategoriasState(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
  
    // Si el prop "categorias" tiene datos (y suponiendo que se mantienen estables), se usan,
    // de lo contrario se hace el fetch solo al montar.
    if (categorias && categorias.length > 0) {
      setCategoriasState(categorias);
    } else {
      fetchCategoriasData();
    }
  }, []); // Ejecuta solo una vez al montar
  


  const fetchProductosData = async () => {
    try {
      const data = await fetchProductos();
      setProductos(Array.isArray(data) ? data : []);
      console.log('Lista de productos:', data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  const handleAgregarProductoClick = () => {
    setProductoEdit(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchProductosData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      fetchProductosData();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setProductoEdit(producto);
    setShowModal(true);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  const handleCheckboxChangeStatus = () => {
    setIsActive(!isActive);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
const handleGuardarProducto = async (id, productoData) => {
  if (id) {
    // Es edición
    await updateProducto(id, productoData);
  } else {
    // Es creación
    await createProducto(productoData);
  }
  fetchProductosData();
};

  // Filtros
  let filteredProductos = productos;
  if (selectedCategoria) {
    filteredProductos = productos.filter((producto) => {
      if (!producto.categorias) return false;
      return producto.categorias.some((cat) => {
        if (typeof cat === 'object' && cat !== null) {
          return cat.nombre === selectedCategoria;
        }
        return cat === selectedCategoria;
      });
    });
  }

  if (isActive) {
    filteredProductos = filteredProductos.filter((producto) => producto.isActive);
  }

  if (searchTerm) {
    filteredProductos = filteredProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  console.log('Productos filtrados:', filteredProductos);

  return (
    <div className="flex h-screen overflow-y-auto">
      <div className="w-full p-5">
        <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>

        {/* Botón Agregar Producto */}
        <button
          onClick={handleAgregarProductoClick}
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors mb-4"
        >
          Agregar Producto
        </button>

        {/* Checkbox Activos */}
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleCheckboxChangeStatus}
            className="mr-2"
          />
          Activos
        </label>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Nombre"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 rounded border border-gray-300 w-full mb-4"
        />

        {/* Select de Categorías */}
        <select
          onChange={handleCategoriaChange}
          value={selectedCategoria}
          className="p-2 rounded border border-gray-300 mb-4"
        >
          <option value="">Todas las Categorías</option>
          {(categoriasState || []).map((categoria, index) => (
            <option key={index} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        {/* Modal para crear/editar producto */}
        {showModal && (
          <CrearProductoModal
            handleCloseModal={handleCloseModal}
            categorias={categoriasState}
            productoEdit={productoEdit}
            onGuardar={handleGuardarProducto}
          />
        )}

        {/* Contenedor de productos */}
        <div className="grid grid-cols-3 gap-5 w-full">
          {(filteredProductos || []).length > 0 ? (
            (filteredProductos || []).map((producto) => (
              <Producto
                key={producto.id}
                producto={producto}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaProductos;
