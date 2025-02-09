import React, { useState, useEffect } from 'react';
import { createProducto, updateProducto, fetchCategorias, fetchIngredientes, uploadImageToS3 } from '../connections';
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

  useEffect(() => {
    const fetchCategoriasData = async () => {
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    const fetchIngredientesData = async () => {
      try {
        const data = await fetchIngredientes();
        setIngredientes(data);
      } catch (error) {
        console.error('Error al cargar los ingredientes:', error);
      }
    };

    fetchCategoriasData();
    fetchIngredientesData();
  }, []);

  useEffect(() => {
    if (productoEdit) {
      setNombre(productoEdit.nombre || '');
      setPrecio(productoEdit.precio || '');
      setDescripcion(productoEdit.descripcion || '');
      setImagenPreview(productoEdit.imagen ? `http://localhost:3000/${productoEdit.imagen}` : null);
      setSelectedCategorias(productoEdit.categorias || []);
      setSelectedIngredientesOriginales(productoEdit.ingredientesOriginales || []);
      setPersonalizable(productoEdit.personalizable || false);
      setIsActive(productoEdit.isActive || false);
    }
  }, [productoEdit]);

  const handleCategoriaChange = (categoria) => {
    const categoriaObj = categorias.find((c) => c.nombre === categoria);
    setSelectedCategorias((prevState) =>
      prevState.some((c) => c.id === categoriaObj.id)
        ? prevState.filter((c) => c.id !== categoriaObj.id)
        : [...prevState, categoriaObj]
    );
  };

  const handleIngredienteChange = (ingrediente) => {
    const ingredienteObj = ingredientes.find((i) => i.nombre === ingrediente);
    setSelectedIngredientesOriginales((prevState) =>
      prevState.some((i) => i.id === ingredienteObj.id)
        ? prevState.filter((i) => i.id !== ingredienteObj.id)
        : [...prevState, ingredienteObj]
    );
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || selectedCategorias.length === 0) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Subir imagen a S3 (si existe)
    if (imagen) {
      await uploadImageToS3(imagen);
    }

    // Construir el objeto Producto
    const producto = new ProductoConnection(
      productoEdit ? productoEdit.id : null,
      nombre,
      parseFloat(precio),
      descripcion,
      imagen?.name || '', // nombre del archivo
      0, // cantidad
      selectedCategorias,
      selectedIngredientesOriginales,
      [], // ingredientesExtras
      personalizable,
      isActive
    );

    const productoJson = JSON.stringify({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen, // nombre del archivo
      categorias: producto.categorias,
      ingredientesOriginales: producto.ingredientesOriginales,
      personalizable: producto.isPersonalizable,
      isActive: producto.isActived
    });

    try {
      if (productoEdit) {
        await updateProducto(productoEdit.id, productoJson, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Producto actualizado exitosamente');
      } else {
        await createProducto(productoJson, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Producto creado exitosamente');
      }
      handleCloseModal && handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-4">
      <h2 className="text-xl font-bold">
        {productoEdit ? 'Editar Producto' : 'Crear Producto'}
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

      {/* Campo Precio */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="p-2 border border-gray-300 rounded resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Subir Imagen */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Subir Imagen:</label>
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
        <label className="mb-1 font-bold">Categorías:</label>
        <div className="flex flex-col space-y-2">
          {categorias.map((categoria, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategorias.some((c) => c.id === categoria.id)}
                onChange={() => handleCategoriaChange(categoria.nombre)}
              />
              {categoria.nombre}
            </label>
          ))}
        </div>
        {selectedCategorias.length === 0 && (
          <p className="text-red-500 text-xs">Debe seleccionar al menos una categoría.</p>
        )}
      </div>

      {/* Ingredientes Originales */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Ingredientes Originales:</label>
        <div className="flex flex-col space-y-2">
          {ingredientes.map((ingrediente, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedIngredientesOriginales.some((i) => i.id === ingrediente.id)}
                onChange={() => handleIngredienteChange(ingrediente.nombre)}
              />
              {ingrediente.nombre}
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

      {/* Botón Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors"
      >
        {productoEdit ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );
};

export default CrearProducto;
