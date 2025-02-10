import axios from 'axios';

const API_URL = 'http://localhost:3000/server';

export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    console.log('Server response:', response); 
    return response.data;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    throw error;
  }
};

export const createProducto = async (producto) => {
  try {
   
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



// getUrlImagenes

const getUploadUrl = async (file) => {
  try {
    const response = await fetch(`http://localhost:3000/s3/generateUploadUrl?key=${file.name}`);
    const data = await response.json();
    return data.uploadUrl; // Devuelve la URL pre-firmada
  } catch (error) {
    console.error("Error al obtener la URL de subida:", error);
    return null;
  }
};

export const uploadImageToS3 = async (file) => {
  const uploadUrl = await getUploadUrl(file);
  if (!uploadUrl) return;

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type }
    });

    if (response.ok) {
      console.log("✅ Imagen subida correctamente");
    } else {
      console.error("❌ Error al subir la imagen:", response.statusText);
    }
  } catch (error) {
    console.error("❌ Error en la subida:", error);
  }
};

  export const obtenerUrlDeImagen = async (key) => {
    try {
      console.log('Key:', key)
      const response = await fetch(`http://localhost:3000/s3/generateDownloadUrl?key=${key}`);
      const data = await response.json();
      return data.downloadUrl;
    } catch (error) {
      console.error('Error obteniendo la URL de la imagen:', error);
      return null;
    }
  };

export default { API_URL, getUploadUrl };
