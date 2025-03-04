import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Ingrediente } from '../../models/model';

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
      <div className="relative bg-cream p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Botón para cerrar (esquina sup. derecha) */}
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-3 text-beef text-xl hover:text-beef-light"
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
              className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark"
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
              className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark "
            />
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="self-start px-8 py-3  bg-[#ffcc3f] text-cream rounded-2xl font-bold hover:bg-mustard/80 transition-colors w-full"
          >
            {ingredienteEdit ? 'Actualizar Ingrediente' : 'Añadir Ingrediente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearIngredienteModal;
