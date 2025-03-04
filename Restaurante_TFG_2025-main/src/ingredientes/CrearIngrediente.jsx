import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearIngrediente = ({ handleCloseModal, ingredienteEdit, addIngrediente }) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [type, setType] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (ingredienteEdit) {
      setNombre(ingredienteEdit.nombre);
      setCantidad(ingredienteEdit.cantidad);
      setType(ingredienteEdit.type);
      setIsActive(ingredienteEdit.isActive);
    }
  }, [ingredienteEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !cantidad || !type) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const ingredienteData = { nombre, cantidad, type, isActive };

    try {
      if (ingredienteEdit) {
        await axios.put(`http://localhost:3000/server/ingredientes/${ingredienteEdit.id}`, ingredienteData);
        alert('Ingrediente actualizado exitosamente');
      } else {
        const response = await axios.post('http://localhost:3000/server/ingredientes', ingredienteData);
        alert('Ingrediente creado exitosamente');
        addIngrediente(response.data);
      }
      handleCloseModal && handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-4">
      <h2 className="text-xl font-bold">
        {ingredienteEdit ? 'Editar Ingrediente' : 'Crear Ingrediente'}
      </h2>

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

      {/* Campo Cantidad */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
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

      {/* Activo (checkbox) */}
      <div className="flex items-center space-x-2">
        <label className="font-bold">Activo:</label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-4 h-4"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded border-none bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
      >
        {ingredienteEdit ? 'Actualizar Ingrediente' : 'Crear Ingrediente'}
      </button>
    </form>
  );
};

export default CrearIngrediente;

