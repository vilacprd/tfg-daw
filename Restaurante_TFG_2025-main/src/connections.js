import axios from 'axios';
import { io } from "socket.io-client";

const API_URL = 'http://localhost:3000/server';
const url = "https://myorderapp-production.up.railway.app/"
export const socket = io("http://localhost:3000");

socket.on("NewOrder", (data) => {
  
 // console.log("New Order", data);

});
socket.on("connection", () => {
  console.log("Connected to socket");
});

export const UpdateStateOrder = async (orderIds) => {
  try {
    const response = await axios.put(`${API_URL}/updateOrderCompleted`, { orderIds });
    console.log('Órdenes actualizadas:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado de la orden", error);
  }
}
export const conectionRemoveProductFromOrder = async (comandaId, productId) => {
  try {
    const response = await axios.put(`${API_URL}/removeProductFromOrder`, { comandaId, productId });
    console.log('Producto eliminado de la orden:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto de la orden", error);
  }
}

export const getDataMesa= async (idMesa) => {
  try {
    const response = await axios.get(`${API_URL}/getMesa/${idMesa}`);
    console.log('Server response:', response);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al cargar las ordenes:', error);
    throw error;
  }
}
export const fetchOrdersActived = async () => {
  try {
    const response = await axios.get(`${API_URL}/getOrdersActives`);
    console.log('Server response:', response);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al cargar las ordenes:', error);
    throw error;
  }
}
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
    console.log("CEG", categoria);
    const response = await axios.post(`${API_URL}/categorias`, categoria, {
      headers: {
        'Content-Type': 'application/json',
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
        'Content-Type': 'application/json',
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

const getUploadUrlProductos = async (file) => {
  try {
    let nameFile = "Img_Productos/"+file.name
    console.log('Nombre del archivo:', nameFile)
    const response = await fetch(`http://localhost:3000/s3/generateUploadUrl/productos?key=${nameFile}`);
    const data = await response.json();
    return data.uploadUrl; // Devuelve la URL pre-firmada
  } catch (error) {
    console.error("Error al obtener la URL de subida:", error);
    return null;
  }
};

const getUploadUrlCategorias = async (file) => {
  try {
    let nameFile = "Img_Categorias/"+file.name
    console.log('Nombre del archivo:', nameFile)
    const response = await fetch(`http://localhost:3000/s3/generateUploadUrl/productos?key=${nameFile}`);
    const data = await response.json();
    return data.uploadUrl; // Devuelve la URL pre-firmada
  } catch (error) {
    console.error("Error al obtener la URL de subida:", error);
    return null;
  }
};
export const uploadImageToS3 = async (file, ubicacion) => {
  var uploadUrl =""
  if(ubicacion === "Img_Productos"){
     uploadUrl = await getUploadUrlProductos(file);
  }else if(ubicacion === "Img_Categorias"){
     uploadUrl = await getUploadUrlCategorias(file);
  }
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

  export const obtenerUrlDeImagen = async (key,ubicacion) => {
    try {
      console.log("Clave enviada para descarga:", key); // Log de la clave enviada

      console.log('Key:', key)
      const response = await fetch(`http://localhost:3000/s3/generateDownloadUrl/productos?key=${key}`);
      const data = await response.json();
      return data.downloadUrl;
    } catch (error) {
      console.error('Error obteniendo la URL de la imagen:', error);
      return null;
    }
  };

export default { API_URL, getUploadUrl: getUploadUrlProductos , fetchOrdersActived};
