import React, { useState, useEffect } from 'react';
import { updateUsuario, createUsuario } from '../connections/usuarios';

const CrearUsuarioModal = ({ handleCloseModal, usuarioEdit }) => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('camarero');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuarioEdit) {
      setNombre(usuarioEdit.nombre);
      setRol(usuarioEdit.rol);
      setPassword(''); // No mostrar contraseñas
    }
  }, [usuarioEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuarioEdit) {
        // Actualizar usuario existente
        await updateUsuario(usuarioEdit.id, { nombre, rol });
        setMensaje("Usuario actualizado correctamente.");
      } else {
        // Crear nuevo usuario
        await createUsuario({ nombre, password, rol });
        setMensaje("Usuario creado correctamente.");
      }
      setError('');

      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      setError(error.message);
      setMensaje('');
    }
  };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{usuarioEdit ? 'Editar Usuario' : 'Crear Usuario'}</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {mensaje && <p className="text-green-500 mb-2">{mensaje}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {!usuarioEdit && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="encargado">Encargado</option>
              <option value="camarero">Camarero</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {usuarioEdit ? 'Actualizar' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuarioModal;
