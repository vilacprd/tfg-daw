import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category } from '../models/model';

const CrearCategoriaModal = ({ handleCloseModal, categoriaEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre);
      setDescripcion(categoriaEdit.descripcion);
      setImagenPreview(`http://localhost:3000/${categoriaEdit.imagen}`);
      setIsActive(categoriaEdit.isActive);
    }
  }, [categoriaEdit]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoria = new Category(
      categoriaEdit ? categoriaEdit.id : null,
      nombre,
      descripcion,
      imagen,
      isActive
    );

    const categoriaJson = JSON.stringify({
      nombre: categoria.nombre,
      descripcion: categoria.description,
      imagen: categoria.imgCategory,
      isActive: categoria.isActive
    });

    console.log('Categoría a crear/actualizar:', categoriaJson);

    try {
      if (categoriaEdit) {
        await axios.put(`http://localhost:3000/server/categorias/${categoriaEdit.id}`, categoriaJson, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Categoría actualizada exitosamente');
      } else {
        await axios.post('http://localhost:3000/server/categorias', categoriaJson, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Categoría creada exitosamente');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  return (
    // Overlay oscuro (fondo)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del modal */}
      <div className="relative bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Botón para cerrar (X) */}
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 text-xl hover:text-gray-700"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">
          {categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border border-gray-300 rounded resize-vertical focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Subir Imagen */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Subir Imagen:</label>
            <input
              type="file"
              onChange={handleImagenChange}
              className="p-1 border border-gray-300 rounded focus:outline-none"
            />
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="mt-2 max-w-full max-h-52 rounded"
              />
            )}
          </div>

          {/* Activo: checkbox */}
          <div className="flex items-center space-x-2">
            <label className="font-bold">Activo:</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="self-start px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            {categoriaEdit ? 'Actualizar Categoría' : 'Añadir Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCategoriaModal;
