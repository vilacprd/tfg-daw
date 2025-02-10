import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comandas = ({ onComandaClick }) => {
  const [comandas, setComandas] = useState([
    {
      id: 1,
      numeroPedido: 101,
      numeroMesa: 5,
      fecha: '2023-10-01T12:34:56Z',
      precioTotal: 45.50,
      estado: 'Pendiente',
      productos: [
        {
          nombre: 'Pizza',
          cantidad: 2,
          notas: 'Sin cebolla',
          precioUnitario: 15.00
        },
        {
          nombre: 'Coca Cola',
          cantidad: 3,
          notas: 'Poco hielo',
          precioUnitario: 5.00
        }
      ]
    },
    {
      id: 2,
      numeroPedido: 102,
      numeroMesa: 3,
      fecha: '2023-10-02T14:20:00Z',
      precioTotal: 30.00,
      estado: 'Completado',
      productos: [
        {
          nombre: 'Hamburguesa',
          cantidad: 1,
          notas: 'Extra queso',
          precioUnitario: 10.00
        },
        {
          nombre: 'Fanta',
          cantidad: 2,
          notas: '',
          precioUnitario: 5.00
        }
      ]
    }
  ]);

  useEffect(() => {
    const fetchComandas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/server/comandas');
        setComandas(response.data);
      } catch (error) {
        console.error('Error al cargar las comandas:', error);
      }
    };
    fetchComandas();
  }, []);

  return (
    <div>
      <h2>Comandas</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 text-left">Nº Pedido</th>
            <th className="py-2 text-left">Nº Mesa</th>
            <th className="py-2 text-left">Fecha</th>
            <th className="py-2 text-left">Precio Total</th>
            <th className="py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {comandas.map((comanda) => (
            <tr key={comanda.id} onClick={() => onComandaClick(comanda)}>
              <td className="py-2 text-left">{comanda.numeroPedido}</td>
              <td className="py-2 text-left">{comanda.numeroMesa}</td>
              <td className="py-2 text-left">{new Date(comanda.fecha).toLocaleDateString()}</td>
              <td className="py-2 text-left">{comanda.precioTotal.toFixed(2)} €</td>
              <td className="py-2 text-left">{comanda.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comandas;
