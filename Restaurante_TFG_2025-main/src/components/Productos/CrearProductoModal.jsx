import React from 'react';
import CrearProducto from './CrearProducto';

const CrearProductoModal = ({ handleCloseModal, categorias, productoEdit }) => {
  return (
    // Overlay oscuro (fondo)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del modal */}
      <div className="relative bg-cream p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Botón para cerrar (X) */}
        <button
          onClick={handleCloseModal}
          className="sticky w-full text-right top-2 right-2 text-beef text-xl hover:opacity-50"
        >
          X
        </button>

        {/* Contenido: el formulario de crear/editar producto */}
        <CrearProducto
          categorias={categorias}
          productoEdit={productoEdit}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default CrearProductoModal;
