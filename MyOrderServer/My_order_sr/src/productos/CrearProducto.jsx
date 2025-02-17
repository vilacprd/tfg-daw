import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  fetchCategorias,
  fetchIngredientes
  // ...
} from '../connections';
import { ProductoConnection } from '../models/model';

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
    // Cargar categorías e ingredientes
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
      setSelectedCategorias(productoEdit.categorias || []);
      setSelectedIngredientesOriginales(productoEdit.ingredientesOriginales || []);
      setPersonalizable(productoEdit.personalizable || false);
      setIsActive(productoEdit.isActive || false);
    }
  }, [productoEdit]);

  const handleCategoriaChange = (categoria) => {
    setSelectedCategorias((prev) =>
      prev.includes(categoria)
        ? prev.filter((cat) => cat !== categoria)
        : [...prev, categoria]
    );
  };

  const handleIngredienteChange = (ingrediente) => {
    setSelectedIngredientesOriginales((prev) =>
      prev.includes(ingrediente)
        ? prev.filter((ing) => ing !== ingrediente)
        : [...prev, ingrediente]
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

    // Construir el objeto en base a la clase, si quieres
    const producto = new ProductoConnection(
      productoEdit ? productoEdit.id : null,
      nombre,
      parseFloat(precio),
      descripcion,
      imagen?.name || '',
      0, // cantidad
      selectedCategorias,
      selectedIngredientesOriginales,
      [],
      personalizable,
      isActive
    );

    // Enviar con FormData
    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('descripcion', producto.descripcion);
    formData.append('personalizable', producto.isPersonalizable);
    formData.append('isActive', producto.isActived);
    // Convertir arrays a JSON
    formData.append('categorias', JSON.stringify(producto.categorias));
    formData.append('ingredientesOriginales', JSON.stringify(producto.ingredientesOriginales));
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (productoEdit) {
        // Editar producto
        await axios.put(
          `http://localhost:3000/server/productos/${productoEdit.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Producto actualizado exitosamente.');
      } else {
        // Crear producto
        await axios.post(
          'http://localhost:3000/server/productos',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMensaje('Producto creado exitosamente.');
      }
      // handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrorMsg('Ocurrió un error al guardar el producto.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg w-[700px] max-h-[80vh] overflow-y-auto shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <h2 className="text-xl font-bold">
            {productoEdit ? 'Editar Producto' : 'Crear Producto'}
          </h2>

          {/* Mensajes de éxito / error */}
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
                    checked={selectedCategorias.includes(cat.nombre)}
                    onChange={() => handleCategoriaChange(cat.nombre)}
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
                    checked={selectedIngredientesOriginales.includes(ing.nombre)}
                    onChange={() => handleIngredienteChange(ing.nombre)}
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
