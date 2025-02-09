import axios from 'axios';

const API_URL = 'http://localhost:3000/server';

export const fetchCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    throw error;
  }
};

export const createCategoria = async (categoria) => {
  try {
    const response = await axios.post(`${API_URL}/categorias`, categoria, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    throw error;
  }
};

export const updateCategoria = async (id, categoria) => {
  try {
    const response = await axios.put(`${API_URL}/categorias/${id}`, categoria, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    throw error;
  }
};
