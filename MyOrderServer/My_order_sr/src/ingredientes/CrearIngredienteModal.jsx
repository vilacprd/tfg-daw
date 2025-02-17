import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ingrediente } from '../models/model';

const CrearIngredienteModal = ({ handleCloseModal, ingredienteEdit }) => {
  const [nombre, setNombre] = useState('');
  const [type, setType] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Mensajes a mostrar
  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (ingredienteEdit) {
      setNombre(ingredienteEdit.nombre || '');
      setType(ingredienteEdit.type || '');
      setCantidad(ingredienteEdit.cantidad || 0);
      if (ingredienteEdit.imagen) {
        setImagenPreview(`http://localhost:3000/${ingredienteEdit.imagen}`);
      }
    }
  }, [ingredienteEdit]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrorMsg('');

    // Construir FormData
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('type', type);
    formData.append('cantidad', cantidad);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (ingredienteEdit) {
        // Editar
        await axios.put(
          `http://localhost:3000/server/ingredientes/${ingredienteEdit.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Ingrediente actualizado exitosamente.');
      } else {
        // Crear
        await axios.post(
          'http://localhost:3000/server/ingredientes',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Ingrediente creado exitosamente.');
      }
      // handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
      setErrorMsg('Ocurrió un error al guardar el ingrediente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {ingredienteEdit ? 'Editar Ingrediente' : 'Crear Nuevo Ingrediente'}
        </h2>

        {/* Mensajes */}
        {mensaje && <p className="text-green-600">{mensaje}</p>}
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Tipo:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Cantidad */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.valueAsNumber)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Imagen (opcional) */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Subir Imagen (opcional):</label>
            <input
              type="file"
              onChange={handleImagenChange}
              className="p-1 border border-gray-300 rounded"
            />
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="mt-2 max-w-full max-h-52 rounded"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
            >
              {ingredienteEdit ? 'Actualizar Ingrediente' : 'Añadir Ingrediente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearIngredienteModal;
