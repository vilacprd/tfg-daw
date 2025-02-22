import React, { useEffect, useState } from 'react';
import { fetchUsuarios, deleteUsuario } from '../connections/usuarios';
import CrearUsuarioModal from './CrearUsuarioModal';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRoles, setFilterRoles] = useState({
    admin: false,
    encargado: false,
    camarero: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState("");
  const [disableConfirm, setDisableConfirm] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Usuario logueado

  useEffect(() => {
    fetchUsuariosData();
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("❌ Error al parsear usuario desde localStorage:", error);
      }
    }
  }, []);

  const fetchUsuariosData = async () => {
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  const handleDeleteRequest = (id, nombre, rol) => {
    if (currentUser && currentUser.id === id && rol === "admin") {
      setDeleteUserId(id);
      setDeleteUsername("");
      setDisableConfirm(true);
      setDeleteConfirm(true);
    } else {
      handleDelete(id);
    }
  };

  const handleOpenModal = () => {
    setUsuarioEdit(null); // Nos aseguramos de que no se pase un usuario para edición
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((user) => user.id !== id)); // Elimina del estado
      setDeleteConfirm(false);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete(deleteUserId);
  
      // Si el usuario eliminado es el que está autenticado, cerrar sesión
      if (currentUser.id === deleteUserId) {
        localStorage.removeItem("usuario"); // Borra los datos del usuario
        localStorage.removeItem("token"); // Borra el token de autenticación
        setCurrentUser(null); // Limpia el estado del usuario
        window.location.reload(); // Recarga la página para ir al Login
      }
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };
  
  const handleEdit = (usuario) => {
    setUsuarioEdit(usuario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioEdit(null);
    fetchUsuariosData();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRoles({
      ...filterRoles,
      [e.target.name]: e.target.checked,
    });
  };

  const handleUsernameInput = (e) => {
    setDeleteUsername(e.target.value);
    setDisableConfirm(e.target.value !== currentUser.nombre);
  };

  // Filtrado de usuarios por nombre y roles seleccionados
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(search.toLowerCase());
    const selectedRoles = Object.keys(filterRoles).filter((role) => filterRoles[role]);
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(usuario.rol);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="ml-[0px] p-5 max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>

      {/* Botón para crear nuevo usuario */}
      <button
        onClick={handleOpenModal}  // ✅ Corrección aquí
        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors mb-4"
      >
        Crear Nuevo Usuario
      </button>

      {/* Filtros */}
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Filtros</h3>

        {/* Buscar por nombre */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={handleSearchChange}
          className="w-full border p-2 rounded mb-2"
        />

        {/* Filtrar por roles */}
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="admin"
              checked={filterRoles.admin}
              onChange={handleRoleFilterChange}
              className="mr-2"
            />
            Administrador
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="encargado"
              checked={filterRoles.encargado}
              onChange={handleRoleFilterChange}
              className="mr-2"
            />
            Encargado
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="camarero"
              checked={filterRoles.camarero}
              onChange={handleRoleFilterChange}
              className="mr-2"
            />
            Camarero
          </label>
        </div>
      </div>

      {/* Lista de usuarios */}
      <h3 className="text-lg font-bold mb-3">Lista de Usuarios</h3>

      {/* Si no hay usuarios filtrados, mostrar mensaje */}
      {filteredUsuarios.length === 0 ? (
        <p className="text-gray-600">No hay usuarios disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="border border-gray-300 rounded-md p-4 bg-white shadow-sm"
            >
              <h4 className="text-lg font-bold mb-2">{usuario.nombre}</h4>

              <p className="text-sm font-bold">Rol:</p>
              <p className="text-sm mb-3">{usuario.rol}</p>

              {/* Botones Editar y Eliminar */}
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(usuario)}
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteRequest(usuario.id, usuario.nombre, usuario.rol)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
                >
                  Eliminar
                </button>
              </div>
              {/* Modal para confirmación de eliminación */}
{deleteConfirm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">⚠️ Confirmar Eliminación</h2>
      <p className="mb-3 text-gray-700">
        Estás a punto de eliminar tu propia cuenta y cerrar tu sesión. Escribe tu nombre <strong>{currentUser.nombre}</strong> para confirmar.
      </p>
      <input
        type="text"
        placeholder="Escribe tu nombre..."
        value={deleteUsername}
        onChange={handleUsernameInput}
        className="w-full border p-2 rounded mb-3"
      />
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setDeleteConfirm(false)} 
          className="px-4 py-2 border rounded"
        >
          Cancelar
        </button>
        <button 
          onClick={handleConfirmDelete} 
          disabled={disableConfirm} 
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}

            </div>
          ))}
        </div>
      )}

      {/* Modal para crear usuario */}
      {showModal && (
        <CrearUsuarioModal
          handleCloseModal={handleCloseModal}
          usuarioEdit={usuarioEdit}
        />
      )}
    </div>
  );
};

export default Usuarios;
