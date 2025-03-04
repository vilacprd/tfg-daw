// UsuariosList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/server/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/server/usuarios/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNombre(user.nombre);
    setRol(user.rol);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/server/usuarios/${editingUser.id}`, { nombre, rol });
      setEditingUser(null);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      {editingUser ? (
        <div className="mb-4 flex flex-col gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2"
            placeholder="Nuevo nombre"
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="border p-2"
          >
            <option value="admin">admin</option>
            <option value="encargado">encargado</option>
            <option value="camarero">camarero</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">Guardar</button>
            <button onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </div>
      ) : (
        // Aquí podrías colocar un botón para "Crear Usuario" si lo deseas.
        null
      )}
      <ul>
        {usuarios.map((user) => (
          <li key={user.id} className="flex justify-between items-center border p-2 my-2">
            <span>{user.nombre} - {user.rol}</span>
            <div>
              <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Editar</button>
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosList;
