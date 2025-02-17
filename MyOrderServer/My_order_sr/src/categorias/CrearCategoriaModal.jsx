import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category } from '../models/model';

const CrearCategoriaModal = ({ handleCloseModal, categoriaEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Mensajes a mostrar en el formulario
  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    setImagenPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrorMsg('');

    const categoria = new Category(
      categoriaEdit ? categoriaEdit.id : null,
      nombre,
      descripcion,
      imagen,
      isActive
    );

    // FormData si subes imagen
    const formData = new FormData();
    formData.append('nombre', categoria.nombre);
    formData.append('descripcion', categoria.description);
    formData.append('isActive', categoria.isActive);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (categoriaEdit) {
        // Editar categoría
        await axios.put(
          `http://localhost:3000/server/categorias/${categoriaEdit.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Categoría actualizada exitosamente.');
      } else {
        // Crear categoría
        await axios.post(
          'http://localhost:3000/server/categorias',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Categoría creada exitosamente.');
      }
      // Cerrar modal o no, según prefieras.
      // handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      setErrorMsg('Ocurrió un error al guardar la categoría.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del modal */}
      <div className="relative bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </h2>

        {/* Mensajes de éxito o error */}
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

          {/* Botones para Cancelar / Guardar */}
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
              {categoriaEdit ? 'Actualizar Categoría' : 'Añadir Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearCategoriaModal;
