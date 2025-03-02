import React, { useState, useEffect } from 'react';
import mesaVerde from '../assets/MesaRestauranteVerdeApp.png';
import mesaRoja from '../assets/MesaRestauranteRojaApp.png';
import '../styles/Comandas.css';
import ComandaDetailsModal from './ComandaDetailsModal';

const Comandas = () => {
  const [mesas, setMesas] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);

  useEffect(() => {
    // Simulated data for mesas
    const mesasData = [
      { id: 1, numero: 1, activa: false, comandas: [] },
      { id: 2, numero: 2, activa: false, comandas: [] },
      { id: 3, numero: 3, activa: false, comandas: [] },
      { id: 4, numero: 4, activa: false, comandas: [] },
      { id: 5, numero: 5, activa: false, comandas: [] },
      { id: 6, numero: 6, activa: false, comandas: [] },
      { id: 7, numero: 7, activa: false, comandas: [] },
      { id: 8, numero: 8, activa: false, comandas: [] },
      { id: 9, numero: 9, activa: false, comandas: [] },
      { id: 10, numero: 10, activa: false, comandas: [] }
    ];
    setMesas(mesasData);

    // Simulated data for comandas
    const comandasData = [
      {
        id: 1,
        fecha: '2025-03-01T17:55:47.428Z',
        total: 121,
        productos: [
          {
            cantidad: 1,
            categoria: [{ id: 1, nombre: 'Pizza' }],
            descripcion: 'Es una pizza Peperonis',
            id: 24,
            idList: 1,
            imagen: 'Img_Productos/Captura de pantalla (8).png',
            ingredientesExtras: [],
            ingredientesOriginales: [{ id: 1, nombre: 'Peperoni' }],
            isActived: true,
            isPersonalizable: true,
            nombre: 'Pizza peperonis',
            precio: 121
          }
        ],
        anotaciones: 'ANOTACIONES',
        estado: 'pendiente',
        mesa: 2
      },
      {
        id: 2,
        fecha: '2025-03-01T18:00:00.000Z',
        total: 50,
        productos: [
          {
            cantidad: 2,
            categoria: [{ id: 2, nombre: 'Bebida' }],
            descripcion: 'Es una Coca Cola',
            id: 25,
            idList: 2,
            imagen: 'Img_Productos/Captura de pantalla (9).png',
            ingredientesExtras: [],
            ingredientesOriginales: [{ id: 2, nombre: 'Coca Cola' }],
            isActived: true,
            isPersonalizable: false,
            nombre: 'Coca Cola',
            precio: 25
          }
        ],
        anotaciones: 'SIN HIELO',
        estado: 'pendiente',
        mesa: 2
      },
      {
        id: 3,
        fecha: '2025-03-01T18:05:00.000Z',
        total: 30,
        productos: [
          {
            cantidad: 1,
            categoria: [{ id: 3, nombre: 'Comida' }],
            descripcion: 'Es una hamburguesa',
            id: 26,
            idList: 3,
            imagen: 'Img_Productos/Captura de pantalla (10).png',
            ingredientesExtras: [],
            ingredientesOriginales: [{ id: 3, nombre: 'Queso' }],
            isActived: true,
            isPersonalizable: true,
            nombre: 'Hamburguesa',
            precio: 30
          }
        ],
        anotaciones: 'EXTRA QUESO',
        estado: 'pendiente',
        mesa: 2
      },
      {
        id: 4,
        fecha: '2025-03-01T18:10:00.000Z',
        total: 20,
        productos: [
          {
            cantidad: 2,
            categoria: [{ id: 4, nombre: 'Bebida' }],
            descripcion: 'Es una Fanta',
            id: 27,
            idList: 4,
            imagen: 'Img_Productos/Captura de pantalla (11).png',
            ingredientesExtras: [],
            ingredientesOriginales: [{ id: 4, nombre: 'Fanta' }],
            isActived: true,
            isPersonalizable: false,
            nombre: 'Fanta',
            precio: 10
          }
        ],
        anotaciones: '',
        estado: 'pendiente',
        mesa: 4
      },
      {
        id: 5,
        fecha: '2025-03-01T18:15:00.000Z',
        total: 40,
        productos: [
          {
            cantidad: 1,
            categoria: [{ id: 5, nombre: 'Comida' }],
            descripcion: 'Es una ensalada',
            id: 28,
            idList: 5,
            imagen: 'Img_Productos/Captura de pantalla (12).png',
            ingredientesExtras: [],
            ingredientesOriginales: [{ id: 5, nombre: 'Tomate' }],
            isActived: true,
            isPersonalizable: true,
            nombre: 'Ensalada',
            precio: 40
          }
        ],
        anotaciones: 'SIN TOMATE',
        estado: 'pendiente',
        mesa: 5
      }
    ];
    setComandas(comandasData);
    ordenarComandas()
  }, []);

  function ordenarComandas(){
    comandas.map((comanda) => {
      switch(comanda.mesa){
        case 1:
          mesas[0].comandas.push(comanda);
          break;
        case 2:
          mesas[1].comandas.push(comanda);
          break;
        case 3:
          mesas[2].comandas.push(comanda);
          break;
        case 4:
          mesas[3].comandas.push(comanda);
          break;
        case 5:
          mesas[4].comandas.push(comanda);
          break;
        case 6:
          mesas[5].comandas.push(comanda);
          break;
        case 7:
          mesas[6].comandas.push(comanda);
          break;
        case 8:
          mesas[7].comandas.push(comanda);
          break;
        case 9:
          mesas[8].comandas.push(comanda);
          break;
        case 10:
          mesas[9].comandas.push(comanda);
          break;
      }
    });
  }
  useEffect(() => {
    if (mesas.length > 0 && comandas.length > 0) {
      // Filter comandas by table and add each comanda to the corresponding table
      const updatedMesas = mesas.map(mesa => {
        const mesaComandas = comandas.filter(comanda => comanda.mesa === mesa.numero);
        return { ...mesa, comandas: mesaComandas, activa: mesaComandas.length > 0 };
      });
      setMesas(updatedMesas);
      ordenarComandas()
    }
  }, [comandas]);

  const handleMesaClick = (mesa) => {
    setSelectedMesa(mesa);
  };

  const closeModal = () => {
    setSelectedMesa(null);
  };

  return (
    <div>
      <h2>Mesas</h2>
      <div className="grid grid-cols-3 gap-4">
        {mesas.map((mesa) => {
          return (
            <div
              key={mesa.id}
              className="cursor-pointer divsMesas"
              onClick={() => handleMesaClick(mesa)}
            >
              <img
                src={mesa.activa ? mesaVerde : mesaRoja}
                alt={`Mesa ${mesa.numero}`}
                className="w-full h-auto"
              />
              <p className='nameMesa'>Mesa {mesa.numero}</p>
            </div>
          );
        })}
      </div>
      {selectedMesa && (
        <ComandaDetailsModal mesa={selectedMesa} onClose={closeModal} />
      )}
    </div>
  );
};

export default Comandas;
