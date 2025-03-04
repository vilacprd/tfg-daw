import { useState, useEffect } from 'react';
import { Category } from '../../models/model';
import { createCategoria, updateCategoria, uploadImageToS3 as uploadImageToS3 } from '../../connections';

const CrearCategoriaModal = ({ handleCloseModal, categoriaEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre);
      setDescripcion(categoriaEdit.descripcion);
      if (categoriaEdit.imagen) {
        setImagenPreview(`http://localhost:3000/${categoriaEdit.imagen}`);
      }
      setIsActive(categoriaEdit.isActive);
    }
  }, [categoriaEdit]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    let imagenUrl = categoriaEdit ? categoriaEdit.imagen : ''; // Mantener la imagen existente si no se modifica

    // Subir imagen a S3 (si existe)
    if (imagen) {
      await uploadImageToS3(imagen, "Img_Categorias");
      imagenUrl = "Img_Categorias/" + imagen.name; // Actualizar la URL de la imagen si se ha subido una nueva
    }

    const categoria = new Category(
      categoriaEdit ? categoriaEdit.id : null,
      nombre,
      descripcion,
      imagenUrl, // Utilizar la URL de la imagen existente o la nueva
      isActive
    );

    const categoriaJson = {
      nombre: categoria.nombre,
      descripcion: categoria.description,
      imagen: categoria.imgCategory, // URL de la imagen
      isActive: categoria.isActive    };

    try {
      if (categoriaEdit) {
        await updateCategoria(categoriaEdit.id, categoriaJson, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Categoría actualizada exitosamente');
      } else {
        console.log("CATEGORIA AL CREAR"+JSON.stringify(categoriaJson));
        await createCategoria(categoriaJson, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Categoría creada exitosamente');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  return (
    // Overlay oscuro (fondo)
    <div className="font-flameSans text-beef fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del modal */}
      <div className="relative bg-cream p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Botón para cerrar (X) */}
        <button
          onClick={handleCloseModal}
          className="sticky top-0 left-0 text-gray-500 text-xl hover:text-gray-700 w-full text-right"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">
          {categoriaEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark "
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col">
            <label className="mb-1 font-bold">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 border border-beef/10 rounded focus:outline-none focus:border-beef/50 bg-cream-dark min-h-28"
            />
          </div>

          {/* Subir Imagen */}
          <div className="flex flex-col ">
            <div></div>
            <label className="mb-1 font-bold">Subir Imagen:</label>
            <div className='relative'>
              <input
                type="file"
                onChange={handleImagenChange}
                className="p-2 border border-beef/10 rounded focus:outline-none w-full relative opacity-0 z-20"
              />
              <div
                className='z-0 absolute p-1 px-1 border rounded-3xl top-0 w-full h-full bg-cream-dark border-beef/20 flex justify-start items-center'
              >
                <span className='text-cream p-1 bg-beef-light px-3 rounded-2xl' >
                  Seleccionar un archivo ...
                </span>
                </div>
            </div>
            
              
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="mt-2 max-w-full max-h-52 rounded"
              />
            )}
          </div>

          {/* Activo: checkbox */}
          <div className="flex items-center space-x-2 relative w-fit">
            <label className="font-bold">Activo:</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className={`${ isActive ? "opacity-100" : "opacity-0"} accent-beef w-5 aspect-square bg-transparent border-beef/10 relative z-10`}
            />
            <div className={`${ isActive ? "opacity-0" : "opacity-100"} z-0 absolute w-5 aspect-square top-[2px] right-0 bg-cream-dark border border-beef/10 box-border rounded-sm`}></div>
          </div>

          {/* Botón de Submit */}
          <button
            type="submit"
            className="self-start px-8 py-3  bg-ketchup text-cream rounded-2xl font-bold hover:bg-ketchup/80 transition-colors"
          >
            {categoriaEdit ? 'Actualizar Categoría' : 'Añadir Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCategoriaModal;
