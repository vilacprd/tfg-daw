import axios from 'axios';

const API_URL = 'http://localhost:3000/server';

export const fetchIngredientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/ingredientes`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar los ingredientes:', error);
    throw error;
  }
};

export const createIngrediente = async (ingrediente) => {
  try {
    const response = await axios.post(`${API_URL}/ingredientes`, ingrediente);
    return response.data;
  } catch (error) {
    console.error('Error al crear el ingrediente:', error);
    throw error;
  }
};

export const updateIngrediente = async (id, ingrediente) => {
  try {
    const response = await axios.put(`${API_URL}/ingredientes/${id}`, ingrediente);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el ingrediente:', error);
    throw error;
  }
};

export const deleteIngrediente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/ingredientes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el ingrediente:', error);
    throw error;
  }
};
