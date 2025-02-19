// server/routes/productos.js
import express from 'express';
import { Producto, Categoria, Ingrediente } from '../models.js'; // Ajusta la ruta si es necesario

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categorias' },
        { model: Ingrediente, as: 'ingredientes' }
      ]
    });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// Puedes agregar otras rutas aquí (POST, PUT, DELETE, etc.)

export default router;
