import axios from 'axios';

const API_URL = "http://localhost:3000/server/usuarios";

/**
 * Obtiene la lista de usuarios desde la API.
 * @returns {Promise<Array>} Lista de usuarios.
 */
export const fetchUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

/**
 * Elimina un usuario por ID.
 * @param {string} id - ID del usuario a eliminar.
 */
export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/server/usuarios/${id}`);
  } catch (error) {
    console.error(`❌ Error al eliminar el usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario.
 * @param {Object} usuario - Datos del usuario a crear.
 * @returns {Promise<Object>} Usuario creado.
 */

export const createUsuario = async (usuario) => {
  try {
    const response = await axios.post(API_URL, usuario, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    throw error;
  }
};


/**
 * Actualiza los datos de un usuario existente.
 * @param {string} id - ID del usuario a actualizar.
 * @param {Object} usuario - Datos actualizados del usuario.
 * @returns {Promise<Object>} Usuario actualizado.
 */
export const updateUsuario = async (id, usuario) => {
  try {
    const response = await axios.put(`http://localhost:3000/server/usuarios/${id}`, usuario, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar usuario con ID ${id}:`, error);
    throw error;
  }
};



