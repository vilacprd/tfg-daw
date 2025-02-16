import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react'; // Icono de encendido/apagado
import ListaProductos from './productos/ListaProductos';
import Categorias from './categorias/Categorias';
import Ingredientes from './ingredientes/Ingredientes';
import Navigation from './Navigation';
import CrearCategoriaModal from './categorias/CrearCategoriaModal';
import CrearProductoModal from './productos/CrearProductoModal';
import CrearIngredienteModal from './ingredientes/CrearIngredienteModal';
import CrearUsuario from './components/Users/CrearUsuario';
import axios from 'axios';

const App = ({ usuario, setUsuario }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // === Secciones existentes (NO se tocan ni eliminan) ===
  const [showProductos, setShowProductos] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showIngredientes, setShowIngredientes] = useState(false);
  const [showCrearCategoria, setShowCrearCategoria] = useState(false);
  const [showCrearProducto, setShowCrearProducto] = useState(false);
  const [showCrearIngrediente, setShowCrearIngrediente] = useState(false);
  const [showCrearUsuario, setShowCrearUsuario] = useState(false);
  const [showMensajes, setShowMensajes] = useState(false);

  // === Estados para mensajes ===
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);

  // Cargar todos los mensajes y su estado no leído
  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        // Obtener mensajes
        const response = await axios.get('http://localhost:3000/server/mensajes');
        setMensajes(response.data);

        // Contar cuántos están sin leer
        const noLeidosResponse = await axios.get('http://localhost:3000/server/mensajes/noleidos');
        setMensajesNoLeidos(noLeidosResponse.data.noLeidos);
      } catch (error) {
        console.error('❌ Error al obtener mensajes:', error);
      }
    };
    fetchMensajes();
  }, []);

  // Si se colapsa la barra lateral => cierra el panel de mensajes
  useEffect(() => {
    if (!sidebarExpanded) {
      setShowMensajes(false);
    }
  }, [sidebarExpanded]);

  // Abrir/cerrar panel de mensajes
  const handleAbrirMensajes = async () => {
    setShowMensajes(!showMensajes);

    // Marcar como leídos si se estaba cerrando y había no leídos
    if (!showMensajes && mensajesNoLeidos > 0) {
      try {
        await axios.put('http://localhost:3000/server/mensajes/marcarLeidos');
        setMensajesNoLeidos(0);
      } catch (error) {
        console.error('❌ Error al marcar mensajes como leídos:', error);
      }
    }
  };

  // Eliminar mensaje
  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/server/mensajes/${id}`);
      setMensajes((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error('❌ Error al eliminar mensaje:', error);
    }
  };

  // Enviar un mensaje
  const handleEnviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/server/mensajes', {
        contenido: nuevoMensaje,
        autor: usuario.nombre,
      });
      setMensajes([...mensajes, response.data]);
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  // Ocultar todas las secciones antes de mostrar otra
  const hideAllSections = () => {
    setShowProductos(false);
    setShowCategorias(false);
    setShowIngredientes(false);
    setShowCrearCategoria(false);
    setShowCrearProducto(false);
    setShowCrearIngrediente(false);
    setShowCrearUsuario(false);
    setShowMensajes(false);
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
  };

  // ID con ceros
  const formattedID = usuario.id.toString().padStart(5, '0');

  // Botones según rol
  const botonesPorRol = {
    admin: [
      { label: 'Productos', action: () => { hideAllSections(); setShowProductos(true); } },
      { label: 'Categorías', action: () => { hideAllSections(); setShowCategorias(true); } },
      { label: 'Ingredientes', action: () => { hideAllSections(); setShowIngredientes(true); } },
      { label: 'Crear Categoría', action: () => { hideAllSections(); setShowCrearCategoria(true); } },
      { label: 'Crear Producto', action: () => { hideAllSections(); setShowCrearProducto(true); } },
      { label: 'Crear Ingrediente', action: () => { hideAllSections(); setShowCrearIngrediente(true); } },
      { label: 'Crear Usuario', action: () => { hideAllSections(); setShowCrearUsuario(true); } },
      { label: '📢 Mensajes', action: handleAbrirMensajes },
    ],
    encargado: [
      { label: 'Productos', action: () => { hideAllSections(); setShowProductos(true); } },
      { label: 'Categorías', action: () => { hideAllSections(); setShowCategorias(true); } },
      { label: 'Ingredientes', action: () => { hideAllSections(); setShowIngredientes(true); } },
      { label: 'Crear Producto', action: () => { hideAllSections(); setShowCrearProducto(true); } },
      { label: 'Crear Ingrediente', action: () => { hideAllSections(); setShowCrearIngrediente(true); } },
      { label: '📢 Mensajes', action: handleAbrirMensajes },
    ],
    camarero: [
      { label: 'Productos', action: () => { hideAllSections(); setShowProductos(true); } },
      { label: 'Categorías', action: () => { hideAllSections(); setShowCategorias(true); } },
      { label: 'Ingredientes', action: () => { hideAllSections(); setShowIngredientes(true); } },
    ],
  };

  return (
    <div className="flex h-screen w-full">
      <Navigation
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        usuario={usuario}
      />

      <div className="flex-grow transition-all duration-300 p-5">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Bienvenid@ {usuario.nombre} - {usuario.rol}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Power className="mr-2" /> Cerrar sesión
          </button>
        </div>
        <p className="text-gray-600 mb-6">Nº de empleado: {formattedID}</p>

        {/* Panel de botones */}
        <div className="grid grid-cols-3 gap-6">
          {botonesPorRol[usuario.rol]?.map((boton, index) => (
            <button
              key={index}
              className="border w-40 h-40 bg-indigo-600 text-white rounded transition-all hover:bg-indigo-500"
              onClick={boton.action}
            >
              {boton.label}
            </button>
          ))}
        </div>

            {/* Render condicional de las secciones */}
            {showProductos && (
              <ListaProductos
                handleCloseModal={() => setShowProductos(false)}
              />
            )}
            {showCategorias && (
              <Categorias
                handleCloseModal={() => setShowCategorias(false)}
              />
            )}
            {showIngredientes && (
              <Ingredientes
                handleCloseModal={() => setShowIngredientes(false)}
              />
            )}
            {showCrearCategoria && (
              <CrearCategoriaModal
                handleCloseModal={() => setShowCrearCategoria(false)}
              />
            )}
            {showCrearProducto && (
              <CrearProductoModal
                handleCloseModal={() => setShowCrearProducto(false)}
              />
            )}
            {showCrearIngrediente && (
              <CrearIngredienteModal
                handleCloseModal={() => setShowCrearIngrediente(false)}
              />
            )}
            {showCrearUsuario && (
              <CrearUsuario
                handleCloseModal={() => setShowCrearUsuario(false)}
              />
            )}


        {/* Sección de Mensajes (NUEVA VERSIÓN) */}
        {showMensajes && (
          <div className="mt-6 p-4 border rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-3">📢 Mensajes</h2>

            {/* Listado de mensajes con área ajustable */}
            <div
              className="
                border
                rounded
                bg-gray-100
                resize
                overflow-auto
                min-h-[80px]
                max-h-[500px]
                p-2
              "
            >
              {mensajes.length > 0 ? (
                mensajes.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2 bg-white mb-1 shadow rounded flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>{msg.autor}:</strong> {msg.contenido}
                      </p>

                      {/* admin o encargado -> ver fecha/hora y estado */}
                      {(['admin', 'encargado'].includes(usuario.rol)) && (
                        <>
                          <p className="text-xs text-gray-500">
                            {new Date(msg.fecha).toLocaleString()}
                          </p>
                          <p
                            className={`text-xs ${msg.leido ? "text-green-600" : "text-red-600"}`}
                          >
                            {msg.leido ? "Leído" : "No leído"}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Eliminar: admin -> cualquiera, encargado -> solo si es el autor */}
                    {usuario.rol === 'admin' ||
                    (usuario.rol === 'encargado' && msg.autor === usuario.nombre) ? (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay mensajes</p>
              )}
            </div>

            {/* admin o encargado -> textarea para enviar */}
            {(usuario.rol === 'admin' || usuario.rol === 'encargado') && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Escribe un mensaje..."
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button
                  onClick={handleEnviarMensaje}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enviar Mensaje
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
