import React, { useState, useEffect } from 'react';
import { createProducto, updateProducto, fetchCategorias, fetchIngredientes, uploadImageToS3 as uploadImageToS3 } from '../../connections';
import { ProductoConnection } from '../../models/model';

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

    let imagenUrl = productoEdit ? productoEdit.imagen : ''; // Mantener la imagen existente si no se modifica

    // Subir imagen a S3 (si existe)
    if (imagen) {
      await uploadImageToS3(imagen, "Img_Productos");
      imagenUrl = "Img_Productos/" + imagen.name; // Actualizar la URL de la imagen si se ha subido una nueva
    }

    // Construir el objeto Producto
    const producto = new ProductoConnection(
      productoEdit ? productoEdit.id : null,
      nombre,
      parseFloat(precio),
      descripcion,
      imagenUrl, // Utilizar la URL de la imagen existente o la nueva
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
      imagen: producto.imagen, // URL de la imagen
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
          className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark "
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
          className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark "
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark min-h-28"
        />
      </div>

      {/* Subir Imagen */}
      <div className="flex flex-col">
        <label className="mb-1 font-bold">Subir Imagen:</label>
        <div className='relative'>
          <input
            type="file"
            onChange={handleImagenChange}
            className="p-2 border border-beef/10 rounded focus:outline-none w-full relative opacity-0 z-20"
          />
          <div className="z-0 absolute p-1 px-1 border rounded-3xl top-0 w-full h-full bg-cream-dark border-beef/20 flex justify-start items-center"><span className="text-cream p-1 bg-beef-light px-3 rounded-2xl">Seleccionar un archivo ...</span></div>
        </div>
        
        {imagenPreview && (
          <img
            src={imagenPreview}
            alt="Vista previa"
            className="mt-2 max-w-full max-h-[200px] rounded"
          />
        )}
      </div>

      {/* Categorías */}
      <div className="flex flex-col pb-[6px] relative">
        <label className="mb-2 font-bold">Categorías:</label>
        <div className="flex flex-col space-y-2">
          {categorias.map((categoria, index) => (
            <label key={index} className="flex items-center gap-2 text-sm capitalize">
              <div className='relative'>
                <input
                  type="checkbox"
                  className='accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110'
                  checked={selectedCategorias.some((c) => c.id === categoria.id)}
                  onChange={() => handleCategoriaChange(categoria.nombre)}
                />
                <div className='z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center '>

                  <div className='scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full'></div>
                </div>
              </div>
              
              {categoria.nombre}
            </label>
          ))}
        </div>
        {selectedCategorias.length === 0 && (
          <p className="text-red-500  text-sm absolute bottom-[-16px]">Debe seleccionar al menos una categoría.</p>
        )}
      </div>

      {/* Ingredientes Originales */}
      <div className="flex flex-col pb-[6px]">
        <label className="mb-1 font-bold">Ingredientes Originales:</label>
        <div className="flex flex-col space-y-2">
          {ingredientes.map((ingrediente, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
              
              <div className='relative'>
                <input
                  type="checkbox"
                  
                  className='accent-beef p-0 opacity-0 checked:opacity-100 z-10 checked:z-40 relative checked:scale-110'
                  checked={selectedIngredientesOriginales.some((i) => i.id === ingrediente.id)}
                  onChange={() => handleIngredienteChange(ingrediente.nombre)}                />
                <div className='z-20 pointer-events-none absolute top-0 left-0 w-full h-full grid place-items-center '>

                  <div className='scale-105 aspect-square rounded-sm bg-cream box-border border border-beef/20 w-full'></div>
                </div>
              </div>
              {ingrediente.nombre}
            </label>
          ))}
        </div>
      </div>

      {/* Personalizable */}
      <div className="flex items-center gap-2">
        <label className="font-bold">Personalizable:</label>
        <div className='relative'>
        <input
            type="checkbox"
          checked={personalizable}
          onChange={(e) => setPersonalizable(e.target.checked)}
          className="w-4 h-4 relative opacity-0 checked:opacity-100 checked:scale-110 checked:z-20 accent-beef"
        />
          <div className='pointer-events-none h-full w-full place-items-center grid absolute top-0 left-0 z-10'>
            <div className='w-full aspect-square box-border border border-beef/20 rounded-sm scale-105 bg-cream'></div>
          </div>
        </div>
        
      </div>

      {/* Activo */}
      <div className="flex items-center gap-2">
        <label className="font-bold">Activo:</label>
        
        <div className='relative'>
          <input
            
            type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-4 h-4 relative opacity-0 checked:opacity-100 checked:scale-110 checked:z-20 accent-beef"
        />
          <div className='pointer-events-none h-full w-full place-items-center grid absolute top-0 left-0 z-10'>
            <div className='w-full aspect-square box-border border border-beef/20 rounded-sm  bg-cream'></div>
          </div>
        </div>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        className="self-start px-8 py-3  bg-lettuce text-cream rounded-2xl font-bold hover:bg-lettuce/80 transition-colors w-full"
      >
        {productoEdit ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );
};

export default CrearProducto;
