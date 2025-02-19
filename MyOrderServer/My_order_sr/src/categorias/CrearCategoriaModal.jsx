import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearCategoriaModal = ({ handleCloseModal, categoriaEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // Mensajes a mostrar
  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre || '');
      setDescripcion(categoriaEdit.descripcion || '');
      setIsActive(categoriaEdit.isActive !== undefined ? categoriaEdit.isActive : true);
      if (categoriaEdit.imagen) {
        setImagenPreview(`http://localhost:3000/${categoriaEdit.imagen}`);
      }
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

    if (!nombre) {
      setErrorMsg('Por favor, complete el campo obligatorio: Nombre.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('isActive', isActive);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (categoriaEdit) {
        await axios.put(
          `http://localhost:3000/server/categorias/${categoriaEdit.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Categoría actualizada exitosamente.');
      } else {
        await axios.post(
          'http://localhost:3000/server/categorias',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Categoría creada exitosamente.');
      }
      // Opcional: handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      setErrorMsg('Ocurrió un error al guardar la categoría.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </h2>
        {mensaje && <p className="text-green-600">{mensaje}</p>}
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border border-gray-300 rounded resize-vertical"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Subir Imagen (opcional):</label>
            <input
              type="file"
              onChange={handleImagenChange}
              className="p-1 border border-gray-300 rounded"
            />
            {imagenPreview && (
              <img src={imagenPreview} alt="Vista previa" className="mt-2 max-w-full max-h-52 rounded" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="font-bold">Activo:</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors">
              {categoriaEdit ? 'Actualizar Categoría' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearCategoriaModal;
