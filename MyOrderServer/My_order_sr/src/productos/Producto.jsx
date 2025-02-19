import React from 'react';
import Imagen from './imagen';

const Producto = ({ producto, handleDelete, handleEdit }) => {
  // Verificamos ambas variantes: minúscula y mayúscula
  const categoriasData = producto.categorias || producto.Categorias || [];
  const ingredientesData = producto.ingredientes || producto.Ingredientes || [];

  let categorias = [];
  let ingredientes = [];

  console.log('Datos Categorías:', categoriasData);
  console.log('Datos Ingredientes:', ingredientesData);

  try {
    if (Array.isArray(categoriasData) && categoriasData.length > 0) {
      categorias = categoriasData.map((categoria) => categoria.nombre);
      console.log('Categorías procesadas:', categorias);
    } else {
      console.log('No se encontraron categorías en el producto.');
    }

    if (Array.isArray(ingredientesData) && ingredientesData.length > 0) {
      ingredientes = ingredientesData; // Directamente usamos los objetos
      console.log('Ingredientes procesados:', ingredientes);
    } else {
      console.log('No se encontraron ingredientes en el producto.');
    }
  } catch (error) {
    console.error('Error al manejar las categorías o ingredientes:', error);
  }

  return (
    <div className="border border-gray-300 rounded-md p-3 w-[300px] bg-white flex flex-col justify-between shadow-sm">
      {/* Cabecera: Título y Precio */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-bold">{producto.nombre}</h4>
        <p className="text-base font-bold text-blue-600">${producto.precio}</p>
      </div>

      {/* Imagen (si existe) */}
      {producto.imagen && (
        <div className="flex justify-center mb-2">
          <Imagen imagenKey={producto.imagen} />
        </div>
      )}

      {/* Descripción */}
      <div className="mb-2">
        <p className="text-xs font-bold">Descripción:</p>
        <p className="text-xs">{producto.descripcion}</p>
      </div>

      {/* Ingredientes */}
      <div className="mb-2">
        <p className="text-xs font-bold">Ingredientes:</p>
        <p className="text-xs">
          {ingredientes.length > 0
            ? ingredientes.map((ing) => ing.nombre).join(', ')
            : 'No especificados'}
        </p>
      </div>

      {/* Info de Categorías y Personalizable */}
      <div className="flex justify-between mb-2">
        {/* Categorías */}
        <div className="flex flex-col bg-gray-50 p-2 rounded mr-1 w-1/2">
          <p className="text-xs font-bold">Categorías:</p>
          <p className="text-xs">
            {categorias.length > 0 ? categorias.join(', ') : 'No especificadas'}
          </p>
        </div>
        {/* Personalizable */}
        <div className="flex flex-col bg-gray-50 p-2 rounded w-1/2">
          <p className="text-xs font-bold">Personalizable:</p>
          <p className="text-xs">{producto.personalizable ? 'Sí' : 'No'}</p>
        </div>
      </div>

      {/* Info de Activo */}
      <div className="flex flex-col bg-gray-50 p-2 rounded mb-2">
        <p className="text-xs font-bold">Activo:</p>
        <p className={`text-xs font-bold ${producto.isActive ? 'text-green-600' : 'text-red-500'}`}>
          {producto.isActive ? 'Sí' : 'No'}
        </p>
      </div>

      {/* Botones Editar y Eliminar */}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => handleEdit(producto)}
          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(producto.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Producto;
