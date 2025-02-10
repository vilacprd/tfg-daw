import React, { useState, useEffect } from 'react';
import { obtenerUrlDeImagen } from '../connections';

const Imagen = ({ imagenKey }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await obtenerUrlDeImagen(imagenKey);
      setImageUrl(url);
    };
    fetchImageUrl();
  }, [imagenKey]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Imagen subida"
          className="max-w-full max-h-full object-cover rounded"
        />
      ) : (
        <p>Cargando imagen...</p>
      )}
    </div>
  );
};

export default Imagen;
