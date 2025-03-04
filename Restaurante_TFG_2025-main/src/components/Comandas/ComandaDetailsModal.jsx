import React, { useEffect, useState } from 'react';
import { UpdateStateOrder, conectionRemoveProductFromOrder, getDataMesa } from '../../connections';

const ComandaDetailsModal = ({ mesa, onClose, mesas, setMesas }) => {
  const [currentMesa, setCurrentMesa] = useState(mesa);

  useEffect(() => {
    setCurrentMesa(mesa);
  }, [mesa]);

  if (!currentMesa || !currentMesa.comandas) {
    return null; // Return null if currentMesa or currentMesa.comandas is undefined
  }

  const SetUpdateStateOrder = async () => {
    var orderIds = [];
    currentMesa.comandas.map((comanda) => {
      orderIds.push(comanda.id);
    });
    console.log("orderIds", orderIds);
    var response = await UpdateStateOrder(orderIds);
    if (response) {
      setCurrentMesa({
        ...currentMesa,
        comandas: [],
        activa: false
      });
      setMesas(prevMesas => {
        const mesaIndex = prevMesas.findIndex(mesa => mesa.numero === currentMesa.numero);
        if (mesaIndex !== -1) {
          const mesasActualizadas = [...prevMesas];
          mesasActualizadas[mesaIndex] = {
            ...mesasActualizadas[mesaIndex],
            comandas: [],
            activa: false
          };
          return mesasActualizadas;
        } else {
          console.warn("Mesa no encontrada para la comanda:", currentMesa);
          return prevMesas;
        }
      });
      onClose();
    }
  };

  const removeProductFromOrder = async (comandaId, productId) => {
    var response = await conectionRemoveProductFromOrder(comandaId, productId);
    if (response) {
      const updatedMesa = await getDataMesa(currentMesa.numero);
      setCurrentMesa({
        ...currentMesa,
        comandas: updatedMesa
      });

      setMesas(prevMesas => {
        const mesaIndex = prevMesas.findIndex(mesa => mesa.numero === currentMesa.numero);
        if (mesaIndex !== -1) {
          const mesasActualizadas = [...prevMesas];
          mesasActualizadas[mesaIndex] = {
            ...mesasActualizadas[mesaIndex],
            comandas: updatedMesa,
            activa: updatedMesa.length > 0
          };
          return mesasActualizadas;
        } else {
          console.warn("Mesa no encontrada para la comanda:", updatedMesa);
          return prevMesas;
        }
      });
    }
  };

  const totalPrice = currentMesa.comandas.reduce((total, comanda) => total + (comanda.total || 0), 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-cream font-flameSans p-8 rounded-lg relative w-4/5 max-w-6xl shadow-lg max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="sticky w-full text-right text-beef top-4 right-4  text-2xl hover:text-beef/50">
          &times;
        </button>
        <h2 className="text-3xl mb-6 font-flame">Detalles de la Mesa {currentMesa.numero}</h2>
        {currentMesa.comandas.map((comanda, comandaIndex) => (
          <div key={comandaIndex} className="mb-6 border border-beef/10 rounded-lg p-4">
            <h3 className="text-2xl font-flame mb-4">Comanda {comanda.id}</h3>
            <p className="mb-4"><strong>Notas o Modificaciones:</strong> {comanda.anotaciones}</p>
            <div className='border border-beef/10 rounded-xl overflow-hidden mb-4 '>
            <table className="min-w-full bg-cream rounded-2xl">
              <thead>
                <tr className="bg-cream-dark">
                  <th className="py-3 px-4 text-left">Nombre del Producto</th>
                  <th className="py-3 px-4 text-left">Cantidad</th>
                  <th className="py-3 px-4 text-left">Precio Unitario</th>
                  <th className="py-3 px-4 text-left">Precio Total</th>
                  <th className="py-3 px-4 text-left">Ingredientes Originales</th>
                  <th className="py-3 px-4 text-left">Ingredientes Extras</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comanda.productos.map((producto, index) => (
                  <tr key={index} className="border-t border-beef/10">
                    <td className="py-3 px-4">{producto.nombre}</td>
                    <td className="py-3 px-4">{producto.cantidad}</td>
                    {console.log("productos console"+ JSON.stringify(producto.ingredientesOriginales))}
                    <td className="py-3 px-4">{producto.precio.toFixed(2)} €</td>
                    <td className="py-3 px-4">{(producto.cantidad * producto.precio).toFixed(2)} €</td>

                    <td className="py-3 px-4">{producto.ingredientesOriginales ? producto.ingredientesOriginales.map(ing => ing.nombre).join(', ') : 'Ninguno'}</td>
                    <td className="py-3 px-4">{producto.ingredientesExtras ? producto.ingredientesExtras.map(ing => ing.nombre).join(', ') : 'Ninguno'}</td>

                    <td className="py-3 px-4 flex space-x-2">
                      <button className="bg-cheddar text-cream px-4 py-1 rounded-2xl font-flame hover:bg-cheddar/70">Editar</button>
                      <button onClick={() => { removeProductFromOrder(comanda.id, producto.id) }} className="bg-ketchup text-cream px-4 py-1 rounded-2xl font-flame hover:bg-ketchup/70">Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            
            <p className="font-flame text-right text-lg">Precio Total de la Comanda: {(comanda.total || 0).toFixed(2)} €</p>
          </div>
        ))}
        <p className=" text-right text-2xl font-flame">Precio Final de la Mesa: {totalPrice.toFixed(2)} €</p>
        <button onClick={SetUpdateStateOrder} className="mt-4  px-8 py-3  bg-beef text-cream rounded-2xl font-bold hover:bg-beef/80 transition-colors">Finalizar Mesa</button>
      </div>
    </div>
  );
};

export default ComandaDetailsModal;
