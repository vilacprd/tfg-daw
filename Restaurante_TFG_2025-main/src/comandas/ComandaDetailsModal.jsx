import React from 'react';

const ComandaDetailsModal = ({ comanda, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg">
        <h2>Detalles de la Comanda</h2>
        <button onClick={onClose} className="mb-4">Cerrar</button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Nombre del Producto</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2">Notas o Modificaciones</th>
              <th className="py-2">Precio Unitario</th>
              <th className="py-2">Precio Total</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {comanda.productos.map((producto, index) => (
              <tr key={index}>
                <td className="py-2">{producto.nombre}</td>
                <td className="py-2">{producto.cantidad}</td>
                <td className="py-2">{producto.notas}</td>
                <td className="py-2">{producto.precioUnitario.toFixed(2)} €</td>
                <td className="py-2">{(producto.cantidad * producto.precioUnitario).toFixed(2)} €</td>
                <td className="py-2">{producto.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComandaDetailsModal;
