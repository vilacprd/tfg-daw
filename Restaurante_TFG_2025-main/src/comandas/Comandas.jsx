import React, { useState, useEffect } from 'react';
import mesaVerde from '../assets/MesaRestauranteVerdeApp.png';
import mesaRoja from '../assets/MesaRestauranteRojaApp.png';
import '../styles/Comandas.css';
import ComandaDetailsModal from './ComandaDetailsModal';
import {fetchOrdersActived, socket} from '../connections';

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
  }, []);

  useEffect(() => {
    const cargarComandas = async () => {
      try {
        var comandasActivas = await fetchOrdersActived(); // ✅ Esperamos la respuesta
        console.log("COMANDA ACTIVAS", comandasActivas);
        setComandas(comandasActivas); // ✅ Ahora tiene los datos correctos
      } catch (error) {
        console.error("Error al obtener las comandas activas", error);
      }
    };

    cargarComandas();
  }, []);

  useEffect(() => {
    socket.on('NewOrder', (newComanda) => {
        console.log("MESA NUEVA COMANDA", newComanda.mesa);
        console.log("MESA NUEVA ", mesas);

        var mesaComanda = mesas.findIndex(mesa => Number(mesa.numero) === Number(newComanda.mesa));
        console.log("MESA COMANDA", mesaComanda);

        if (mesaComanda !== -1) { 
            // Clonar el estado correctamente
            var mesasActualizadas = [...mesas];
            mesasActualizadas[mesaComanda] = {
                ...mesasActualizadas[mesaComanda],
                comandas: [...mesasActualizadas[mesaComanda].comandas, newComanda],
                activa: true
            };
            
            console.log("MESA ACTUALIZADA", mesasActualizadas);
            setMesas(mesasActualizadas);

            // Reload the modal if it is open
            if (selectedMesa && selectedMesa.numero === newComanda.mesa) {
              setSelectedMesa(mesasActualizadas[mesaComanda]);
            }

        } else {
            console.warn("Mesa no encontrada para la comanda:", newComanda);
        }
    });

    return () => socket.off('NewOrder');
}, [mesas, selectedMesa]); // Dependencia del useEffect

  useEffect(() => {
    setMesas(prevMesas => {
      const updatedMesas = prevMesas.map(mesa => {
        const mesaComandas = comandas.filter(comanda => comanda.mesa === mesa.numero);
        return { ...mesa, comandas: mesaComandas, activa: mesaComandas.length > 0 };
      });
      return updatedMesas;
    });
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
        <ComandaDetailsModal mesa={selectedMesa} onClose={closeModal} mesas={mesas} setMesas={setMesas} />
      )}
    </div>
  );
};

export default Comandas;
