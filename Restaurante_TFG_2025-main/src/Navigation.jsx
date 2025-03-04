import React from 'react';
import { useUser } from './context/userContext';

const Navigation = ({
  handleButtonClick,        // Productos
  handleCategoryClick,      // Categorías
  handleIngredienteClick,   // Ingredientes
  handleComandasClick,      // Mostrar Comandas
  handleUsuariosClick,      // Usuarios
}) => {
   const { usuario } = useUser();
  return (
    <nav className="w-[200px] h-screen fixed top-0 bg-indigo-700 text-white p-4 shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Panel de Comandas
      </h2>
      <ul className="flex flex-col space-y-3">
        {/* Solo admin y encargado pueden ver categorías, productos e ingredientes */}
        {(usuario.rol === 'admin' || usuario.rol === 'encargado') && (
          <>
            <li>
              <button
                onClick={handleCategoryClick}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
              >
                Categorías
              </button>
            </li>
            <li>
              <button
                onClick={handleButtonClick}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
              >
                Productos
              </button>
            </li>
            <li>
              <button
                onClick={handleIngredienteClick}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
              >
                Ingredientes
              </button>
            </li>
          </>
        )}
        {/* Mostrar Comandas solo para camareros, admin y encargado */}
        {(usuario.rol === 'admin' || usuario.rol === 'encargado' || usuario.rol === 'camarero') && (
          <li>
            <button
              onClick={handleComandasClick}
              className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              Mostrar Comandas
            </button>
          </li>
        )}
        {/* Mostrar Usuarios solo para admin */}
        {usuario.rol === 'admin' && (
          <li>
            <button
              onClick={handleUsuariosClick}
              className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              Usuarios
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;