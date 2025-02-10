import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearIngredienteModal from './CrearIngredienteModal';

const Ingredientes = ({ handleCrearIngredienteClick }) => {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteEdit, setIngredienteEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchIngredientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/server/ingredientes');
      setIngredientes(response.data);
    } catch (error) {
      console.error('Error al cargar los ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/server/ingredientes/${id}`);
      setIngredientes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
    }
  };

  const handleEdit = (ingrediente) => {
    setIngredienteEdit(ingrediente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIngredienteEdit(null);
    fetchIngredientes(); // Recargar lista después de crear/editar
  };

  return (
    
    <div className="ml-[0px] p-5 max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Ingredientes</h2>

      {/* Botón para crear nuevo ingrediente */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors mb-4"
      >
        Crear Nuevo Ingrediente
      </button>

      {/* Contenedor grid */}
      <div className="grid grid-cols-3 gap-5">
        {ingredientes.map((ingrediente, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md p-3 w-[250px] bg-white shadow-sm"
          >
            <h4 className="text-base font-bold mb-2">{ingrediente.nombre}</h4>

            <p className="text-xs font-bold">Cantidad:</p>
            <p className="text-xs mb-2">{ingrediente.cantidad}</p>

            <p className="text-xs font-bold">Tipo:</p>
            <p className="text-xs mb-2">{ingrediente.type}</p>

            {/* Botones Editar/Eliminar */}
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleEdit(ingrediente)}
                className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(ingrediente.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar ingrediente */}
      {showModal && (
        <CrearIngredienteModal
          handleCloseModal={handleCloseModal}
          ingredienteEdit={ingredienteEdit}
        />
      )}
    </div>
  );
};

export default Ingredientes;
