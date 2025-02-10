import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import { sequelize, Product, Categoria, Ingrediente } from './db.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Rutas de Productos
app.post('/server/productos', upload.single('imagen'), async (req, res) => {
  try {
    const productData = req.body;
    if (req.file) {
      productData.imagen = req.file.filename;
    }
    const product = await Product.create(productData);
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/server/productos', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/server/productos/:id', upload.single('imagen'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const productData = req.body;
      if (req.file) {
        productData.imagen = req.file.filename;
      }
      await product.update(productData);
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/server/productos/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.status(200).send({ message: 'Producto eliminado' });
    } else {
      res.status(404).send({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Rutas de Categorías
app.post('/server/categorias', upload.single('imagen'), async (req, res) => {
  try {
    const categoriaData = req.body;
    if (req.file) {
      categoriaData.imagen = req.file.filename;
    }
    const categoria = await Categoria.create(categoriaData);
    res.status(201).send(categoria);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/server/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).send(categorias);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/server/categorias/:id', upload.single('imagen'), async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (categoria) {
      const categoriaData = req.body;
      if (req.file) {
        categoriaData.imagen = req.file.filename;
      }
      await categoria.update(categoriaData);
      res.status(200).send(categoria);
    } else {
      res.status(404).send({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/server/categorias/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (categoria) {
      await categoria.destroy();
      res.status(200).send({ message: 'Categoría eliminada' });
    } else {
      res.status(404).send({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Rutas de Ingredientes
app.post('/server/ingredientes', async (req, res) => {
  try {
    const ingredienteData = req.body;
    const ingrediente = await Ingrediente.create(ingredienteData);
    res.status(201).send(ingrediente);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/server/ingredientes', async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.status(200).send(ingredientes);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/server/ingredientes/:id', async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (ingrediente) {
      const ingredienteData = req.body;
      await ingrediente.update(ingredienteData);
      res.status(200).send(ingrediente);
    } else {
      res.status(404).send({ message: 'Ingrediente no encontrado' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/server/ingredientes/:id', async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (ingrediente) {
      await ingrediente.destroy();
      res.status(200).send({ message: 'Ingrediente eliminado' });
    } else {
      res.status(404).send({ message: 'Ingrediente no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
