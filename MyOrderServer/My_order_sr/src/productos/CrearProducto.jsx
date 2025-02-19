import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchCategorias, fetchIngredientes } from '../connections';

const CrearProducto = ({ handleCloseModal, productoEdit }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedIngredientesOriginales, setSelectedIngredientesOriginales] = useState([]);
  const [personalizable, setPersonalizable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  // Mensajes
  const [mensaje, setMensaje] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await fetchCategorias();
        setCategorias(catData);
        const ingData = await fetchIngredientes();
        setIngredientes(ingData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setErrorMsg('No se pudieron cargar categorías o ingredientes.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (productoEdit) {
      setNombre(productoEdit.nombre || '');
      setPrecio(productoEdit.precio || '');
      setDescripcion(productoEdit.descripcion || '');
      if (productoEdit.imagen) {
        setImagenPreview(`http://localhost:3000/${productoEdit.imagen}`);
      }
      
      // Para Categorías (revisa ambas variantes: minúsculas y mayúsculas)
      const categoriasEdit = productoEdit.categorias || productoEdit.Categorias || [];
      setSelectedCategorias(
        categoriasEdit.map(cat => typeof cat === 'object' ? cat.id : cat)
      );
  
      // Para Ingredientes (revisa ambas variantes)
      const ingredientesEdit = productoEdit.ingredientes || productoEdit.Ingredientes || [];
      setSelectedIngredientesOriginales(
        ingredientesEdit.map(ing => typeof ing === 'object' ? ing.id : ing)
      );
  
      setPersonalizable(productoEdit.personalizable || false);
      setIsActive(productoEdit.isActive || false);
    }
  }, [productoEdit]);
  

  const handleCategoriaChange = (categoriaId) => {
    setSelectedCategorias((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => cat !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const handleIngredienteChange = (ingredienteId) => {
    setSelectedIngredientesOriginales((prev) =>
      prev.includes(ingredienteId)
        ? prev.filter((id) => id !== ingredienteId)
        : [...prev, ingredienteId]
    );
  };
 
  
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrorMsg('');

    if (!nombre || !precio || selectedCategorias.length === 0) {
      setErrorMsg('Por favor, complete los campos obligatorios.');
      return;
    }

    // Construir FormData a partir de los valores de estado
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', parseFloat(precio));
    formData.append('descripcion', descripcion);
    formData.append('personalizable', personalizable);
    formData.append('isActive', isActive);
    formData.append('categorias', JSON.stringify(selectedCategorias));
    formData.append('ingredientes', JSON.stringify(selectedIngredientesOriginales));
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (productoEdit) {
        await axios.put(`http://localhost:3000/server/productos/${productoEdit.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMensaje('Producto actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:3000/server/productos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMensaje('Producto creado exitosamente.');
      }
      // Opcional: handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrorMsg('Ocurrió un error al guardar el producto.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Contenedor ampliado con scroll si es necesario */}
      <div className="relative bg-white p-6 rounded-lg w-[900px] h-[80vh] overflow-y-auto shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full h-full">
          <h2 className="text-xl font-bold">
            {productoEdit ? 'Editar Producto' : 'Crear Producto'}
          </h2>

          {mensaje && <p className="text-green-600">{mensaje}</p>}
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}

          {/* Campo Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Nombre (obligatorio):</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Campo Precio */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Precio (obligatorio):</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border border-gray-300 rounded resize-vertical"
            />
          </div>

          {/* Subir Imagen */}
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
                className="mt-2 max-w-full max-h-[200px] rounded"
              />
            )}
          </div>

          {/* Categorías */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Categorías (obligatorio al menos 1):</label>
            <div className="flex flex-col space-y-2">
              {categorias.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategorias.includes(cat.id)}
                    onChange={() => handleCategoriaChange(cat.id)}
                  />
                  {cat.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Ingredientes Originales */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Ingredientes Originales:</label>
            <div className="flex flex-col space-y-2">
              {ingredientes.map((ing) => (
                <label key={ing.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIngredientesOriginales.includes(ing.id)}
                    onChange={() => handleIngredienteChange(ing.id)}
                  />
                  {ing.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Personalizable */}
          <div className="flex items-center gap-2">
            <label className="font-bold">Personalizable:</label>
            <input
              type="checkbox"
              checked={personalizable}
              onChange={(e) => setPersonalizable(e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2">
            <label className="font-bold">Activo:</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-auto">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors"
            >
              {productoEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearProducto;
