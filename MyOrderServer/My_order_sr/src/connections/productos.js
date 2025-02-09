import axios from 'axios';

const API_URL = 'http://localhost:3000/server';

export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    console.log('Server response:', response); // Added console log
    return response.data;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    throw error;
  }
};

export const createProducto = async (producto) => {
  try {
    console.log('intentando crear producto ', producto.nombre);
    console.log('intentando crear producto ', producto.personalizable);
    console.log('intentando crear producto ', producto.isActive);
    const response = await axios.post(`${API_URL}/productos`, producto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};

export const updateProducto = async (id, producto) => {
  try {
    const response = await axios.put(`${API_URL}/productos/${id}`, producto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};
