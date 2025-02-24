import axios from 'axios';

const API_URL = 'http://localhost:3000/server';
const url = "https://myorderapp-production.up.railway.app/server"
export const fetchProductos = async () => {
  try {
    const response = await axios.get(`${url}/productos`);
    console.log('Server response:', response); 
    return response.data;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    throw error;
  }
};

export const createProducto = async (producto) => {
  try {
   
    const response = await axios.post(`${url}/productos`, producto, {
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
    const response = await axios.put(`${url}/productos/${id}`, producto, {
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
    const response = await axios.delete(`${url}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw error;
  }
};

export const fetchCategorias = async () => {
  try {
    const response = await axios.get(`${url}/categorias`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
    throw error;
  }
};

export const createCategoria = async (categoria) => {
  try {
    const response = await axios.post(`${url}/categorias`, categoria, {
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
    const response = await axios.put(`${url}/categorias/${id}`, categoria, {
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
    const response = await axios.delete(`${url}/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    throw error;
  }
};

export const fetchIngredientes = async () => {
  try {
    const response = await axios.get(`${url}/ingredientes`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar los ingredientes:', error);
    throw error;
  }
};

export const createIngrediente = async (ingrediente) => {
  try {
    const response = await axios.post(`${url}/ingredientes`, ingrediente);
    return response.data;
  } catch (error) {
    console.error('Error al crear el ingrediente:', error);
    throw error;
  }
};

export const updateIngrediente = async (id, ingrediente) => {
  try {
    const response = await axios.put(`${url}/ingredientes/${id}`, ingrediente);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el ingrediente:', error);
    throw error;
  }
};

export const deleteIngrediente = async (id) => {
  try {
    const response = await axios.delete(`${ur}/ingredientes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el ingrediente:', error);
    throw error;
  }
};



// getUrlImagenes

const getUploadUrlProductos = async (file) => {
  try {
   // file = "/Img_Productos/" + file;
    const response = await fetch(`https://myorderapp-production.up.railway.app/s3/generateUploadUrl/productos?key=${file.name}`);
    const data = await response.json();
    return data.uploadUrl; // Devuelve la URL pre-firmada
  } catch (error) {
    console.error("Error al obtener la URL de subida:", error);
    return null;
  }
};

export const uploadImageToS3Productos = async (file) => {
  const uploadUrl = await getUploadUrlProductos(file);
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

  export const obtenerUrlDeImagenProductos = async (key) => {
    try {
      console.log('Key:', key)
      const response = await fetch(`https://myorderapp-production.up.railway.app/s3/generateDownloadUrl/productos?key=${key}`);
      const data = await response.json();
      return data.downloadUrl;
    } catch (error) {
      console.error('Error obteniendo la URL de la imagen:', error);
      return null;
    }
  };

export default { API_URL, getUploadUrl: getUploadUrlProductos };
