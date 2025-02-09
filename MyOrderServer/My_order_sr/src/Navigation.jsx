import React from 'react';

const Navigation = ({ handleButtonClick, handleCategoryClick, handleIngredienteClick }) => {
  return (
    <nav className="w-[200px] h-screen fixed top-0 bg-indigo-700 text-white p-4 shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Panel de Comandas
      </h2>
      <ul className="flex flex-col space-y-3">
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
      </ul>
    </nav>
  );
};

export default Navigation;
