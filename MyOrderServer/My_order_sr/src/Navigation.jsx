import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bell,
  MessageSquare,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import axios from "axios";

const Navigation = ({ sidebarExpanded, setSidebarExpanded }) => {
  const [stats, setStats] = useState({ pedidosMes: 0 });
  const [lastOrder, setLastOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessages, setShowMessages] = useState(false);

  // === Llamadas a la API (estadísticas, último pedido, mensajes, no leídos) ===
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/server/estadisticas");
        setStats(response.data);
      } catch (error) {
        console.error("Error al obtener estadísticas", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const response = await axios.get("http://localhost:3000/server/ultimo-pedido");
        setLastOrder(response.data);
      } catch (error) {
        console.error("Error al obtener el último pedido", error);
      }
    };
    fetchLastOrder();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/server/mensajes");
        setMessages(response.data);
      } catch (error) {
        console.error("Error al obtener mensajes", error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/server/mensajes/noleidos");
        setUnreadCount(response.data.noLeidos);
      } catch (error) {
        console.error("Error al obtener mensajes no leídos", error);
      }
    };
    fetchUnreadCount();
  }, []);

  // === Expandir/colapsar barra lateral ===
  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
    setShowMessages(false); // Cierra el panel de mensajes al colapsar la barra
  };

  // === Forzar expansión si está colapsada ===
  const handleExpand = () => {
    if (!sidebarExpanded) {
      setSidebarExpanded(true);
    }
  };

  // === Al hacer clic en el icono de Mensajes ===
  const handleMessagesClick = async () => {
    // Primero, asegurarnos de expandir la barra
    handleExpand();

    // Luego, alternar visualización de mensajes
    setShowMessages((prev) => !prev);

    // Marcar como leídos si había no leídos y se está abriendo el panel
    if (!showMessages && unreadCount > 0) {
      try {
        await axios.put("http://localhost:3000/server/mensajes/marcarLeidos");
        setUnreadCount(0);
      } catch (error) {
        console.error("Error al marcar mensajes como leídos", error);
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-indigo-700 text-white transition-all duration-300 ${
        sidebarExpanded ? "w-64" : "w-16"
      }`}
    >
      {/* Botón para expandir/colapsar */}
      <div className="flex justify-end p-2">
        <button className="bg-indigo-600 p-1 rounded-full" onClick={handleToggleSidebar}>
          {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="p-4 flex flex-col items-start space-y-6">
        {/* Estadísticas */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleExpand}
        >
          <BarChart />
          {sidebarExpanded && (
            <span>Pedidos este mes: {stats.pedidosMes}</span>
          )}
        </div>

        {/* Último pedido */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleExpand}
        >
          <Bell />
          {sidebarExpanded && lastOrder && (
            <span>
              Pedido #{lastOrder.id} - {lastOrder.estado}
            </span>
          )}
        </div>

        {/* Mensajes con contador de no leídos */}
        <div
          className="relative flex items-center space-x-3 cursor-pointer"
          onClick={handleMessagesClick}
        >
          <MessageSquare />
          {sidebarExpanded && <span>Mensajes</span>}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Panel de mensajes */}
        {showMessages && (
          <div className="w-full bg-white text-black p-3 mt-2 rounded-md h-40 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="border-b py-2">
                  <strong>{msg.autor}:</strong> {msg.contenido}
                </div>
              ))
            ) : (
              <p>No hay mensajes</p>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
