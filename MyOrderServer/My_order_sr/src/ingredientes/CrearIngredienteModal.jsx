import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ingrediente } from '../models/model';

const CrearIngredienteModal = ({ handleCloseModal, ingredienteEdit }) => {
  const [nombre, setNombre] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (ingredienteEdit) {
      setNombre(ingredienteEdit.nombre);
      setType(ingredienteEdit.type);
    }
  }, [ingredienteEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingrediente = new Ingrediente(
      ingredienteEdit ? ingredienteEdit.id : null,
      nombre,
      0, // Cantidad predeterminada 0
      type
    );

    const ingredienteData = {
      nombre: ingrediente.nombre,
      cantidad: ingrediente.cantidad,
      type: ingrediente.type,
    };

    try {
      if (ingredienteEdit) {
        await axios.put(`http://localhost:3000/server/ingredientes/${ingredienteEdit.id}`, ingredienteData);
        alert('Ingrediente actualizado exitosamente');
      } else {
        await axios.post('http://localhost:3000/server/ingredientes', ingredienteData);
        alert('Ingrediente creado exitosamente');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
    }
  };

  return (
    // Overlay (fondo oscuro)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del modal */}
      <div className="relative bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Botón para cerrar (esquina sup. derecha) */}
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 text-xl hover:text-gray-700"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">
          {ingredienteEdit ? 'Editar Ingrediente' : 'Crear Nuevo Ingrediente'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Campo Tipo */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Tipo:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
          >
            {ingredienteEdit ? 'Actualizar Ingrediente' : 'Añadir Ingrediente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearIngredienteModal;
