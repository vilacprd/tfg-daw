import React, { useEffect, useState } from 'react';
import { fetchCategorias, deleteCategoria } from '../connections';
import CrearCategoriaModal from './CrearCategoriaModal';

const Categorias = ({ handleCrearCategoriaClick }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showActive, setShowActive] = useState(false);

  const fetchCategoriasData = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategoriasData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategoria(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleEdit = (categoria) => {
    setCategoriaEdit(categoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaEdit(null);
    fetchCategoriasData(); // Recargar cambios
  };

  const handleCheckboxChange = () => {
    setShowActive(!showActive);
  };

  const filteredCategorias = showActive
    ? categorias.filter((categoria) => categoria.isActive)
    : categorias;

  return (
    <div className="ml-[0px] p-5 max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Categorías</h2>

      {/* Botón para crear nueva categoría */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors mb-4"
      >
        Crear Nueva Categoría
      </button>

      {/* Checkbox para filtrar 'Activos' */}
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={showActive}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        Activos
      </label>

      {/* Contenedor en grid para mostrar categorías */}
      <div className="grid grid-cols-3 gap-5">
        {filteredCategorias.map((categoria, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm w-[250px]"
          >
            <h4 className="text-base font-bold mb-2">{categoria.nombre}</h4>

            <p className="text-xs font-bold">Descripción:</p>
            <p className="text-xs mb-2">{categoria.descripcion}</p>

            {categoria.imagen && (
              <>
                <p className="text-xs font-bold">Imagen:</p>
                <img
                  src={`http://localhost:3000/${categoria.imagen}`}
                  alt={categoria.nombre}
                  className="mt-2 max-w-full max-h-24 rounded"
                />
              </>
            )}

            {/* Condicional para el estado Activo/Inactivo */}
            <p
              className={`text-xs font-bold mt-2 ${
                categoria.isActive ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {categoria.isActive ? 'Activo' : 'Inactivo'}
            </p>

            {/* Botones Editar y Eliminar */}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEdit(categoria)}
                className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(categoria.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar categoría */}
      {showModal && (
        <CrearCategoriaModal
          handleCloseModal={handleCloseModal}
          categoriaEdit={categoriaEdit}
        />
      )}
    </div>
  );
};

export default Categorias;
