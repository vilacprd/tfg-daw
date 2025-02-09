import React, { useState } from 'react';
import axios from 'axios';

const FormularioProducto = ({ agregarProducto }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nombre && precio) {
      try {
        await axios.post('http://localhost:3000/server/productos', { nombre, precio });
        agregarProducto({ nombre, precio });
        setNombre('');
        setPrecio('');
      } catch (error) {
        console.error('Error al guardar el producto:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 w-full max-w-sm">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-500 transition-colors"
      >
        Agregar Producto
      </button>
    </form>
  );
};

export default FormularioProducto;
