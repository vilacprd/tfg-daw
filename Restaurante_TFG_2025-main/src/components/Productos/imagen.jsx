import { useState, useEffect } from 'react';
import LogoStroke from '../LogoStroke/LogoStroke';
import { obtenerUrlDeImagen } from '../../connections';

const ImagenProductos = ({ imagenKey,alt }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await obtenerUrlDeImagen(imagenKey, "Img_Productos");
      setImageUrl(url);
    };
    fetchImageUrl();
  }, [imagenKey]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-center object-cover"
        />
      ) : (
          
          <div className='bg-beef-light/80 animate-pulse w-full h-full min-w-12 min-h-12 grid place-items-center box-border p-4'>
            <LogoStroke className={"max-w-20 max-h-20"} bunStroke={"rgb(56 9 6 / 1)"} joeStroke={"rgb(56 9 6 / 1)"} hungryStroke={"rgb(56 9 6 / 1)"}></LogoStroke>
        </div>
      )}
    </div>
  );
};

export default ImagenProductos;
