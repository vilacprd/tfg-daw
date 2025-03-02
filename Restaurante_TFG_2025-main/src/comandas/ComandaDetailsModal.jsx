import React from 'react';

const ComandaDetailsModal = ({ mesa, onClose }) => {
  if (!mesa || !mesa.comandas) {
    return null; // Return null if mesa or mesa.comandas is undefined
  }

  const totalPrice = mesa.comandas.reduce((total, comanda) => total + (comanda.total || 0), 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg relative w-3/4 max-w-4xl shadow-lg max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6">Detalles de la Mesa {mesa.numero}</h2>
        {mesa.comandas.map((comanda, comandaIndex) => (
          <div key={comandaIndex} className="mb-6 border border-gray-300 rounded-lg p-4">
            <h3 className="text-2xl font-bold mb-4">Comanda {comanda.id}</h3>
            <p className="mb-4"><strong>Notas o Modificaciones:</strong> {comanda.anotaciones}</p>
            <table className="min-w-full bg-white mb-4 border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Nombre del Producto</th>
                  <th className="py-3 px-4 text-left">Cantidad</th>
                  <th className="py-3 px-4 text-left">Precio Unitario</th>
                  <th className="py-3 px-4 text-left">Precio Total</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comanda.productos.map((producto, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-3 px-4">{producto.nombre}</td>
                    <td className="py-3 px-4">{producto.cantidad}</td>
                    <td className="py-3 px-4">{producto.precio.toFixed(2)} €</td>
                    <td className="py-3 px-4">{(producto.cantidad * producto.precio).toFixed(2)} €</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Editar</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="font-bold text-right text-lg">Precio Total de la Comanda: {(comanda.total || 0).toFixed(2)} €</p>
          </div>
        ))}
        <p className="font-bold text-right text-xl">Precio Final de la Mesa: {totalPrice.toFixed(2)} €</p>
      </div>
    </div>
  );
};

export default ComandaDetailsModal;
