import React, { useState, useEffect } from 'react';

const EditarProducto = ({ producto, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio);
  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(producto.imagenUrl);

  useEffect(() => {
    if (producto.imagenUrl) {
      setImagenUrl(producto.imagenUrl);
    }
  }, [producto.imagenUrl]);

  const handleSave = () => {
    const updatedProducto = {
      ...producto,
      nombre,
      precio,
      imagen: imagen || producto.imagen,
      imagenUrl: imagen ? URL.createObjectURL(imagen) : imagenUrl
    };
    onSave(updatedProducto);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if(file != null) {
    
    setImagen(file);
    setImagenUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Editar Producto</h2>
      <form>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input type="file" onChange={handleImagenChange} />
          {imagenUrl && <img src={imagenUrl} alt="Producto" width="100" />}
        </div>
        <button type="button" onClick={handleSave}>Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarProducto;
