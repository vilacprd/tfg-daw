import React from 'react';

const ComandaDetails = ({ comanda, onBack }) => {
  return (
    <div className="p-5 font-flame">
      <h2 className="text-3xl font-bold mb-4">Detalles de la Comanda</h2>
      <p className="mb-4">Estado: {comanda.estado}</p>
      <button 
        onClick={onBack} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Volver
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 text-left">Nombre del Producto</th>
            <th className="py-2 text-left">Cantidad</th>
            <th className="py-2 text-left">Notas o Modificaciones</th>
            <th className="py-2 text-left">Precio Unitario</th>
            <th className="py-2 text-left">Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {comanda.productos.map((producto, index) => (
            <tr key={index}>
              <td className="py-2 text-left">{producto.nombre}</td>
              <td className="py-2 text-left">{producto.cantidad}</td>
              <td className="py-2 text-left">{producto.notas}</td>
              <td className="py-2 text-left">{producto.precioUnitario.toFixed(2)} €</td>
              <td className="py-2 text-left">{(producto.cantidad * producto.precioUnitario).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComandaDetails;
