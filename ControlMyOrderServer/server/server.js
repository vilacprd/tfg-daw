import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Ingrediente, Category, ProductoConnection } from './models.js'; // Importa las clases
import { Usuario } from './models.js'; // Importa el modelo Usuario
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 
import AWS from 'aws-sdk';

const app = express();
const port = 3000;
const SECRET_KEY = "claveSecreta"; // Cámbiala en producción

// Middleware
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar a SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

// Modelo de Producto
const Product = sequelize.define('Product', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  imagen: {
    type: DataTypes.STRING,
  },
  categorias: {
    type: DataTypes.TEXT, // Cambia a TEXT para almacenar JSON como string
  },
  ingredientesOriginales: {
    type: DataTypes.STRING,
  },
  personalizable: {
    type: DataTypes.BOOLEAN,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
});

// Modelo de Categoría
const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  imagen: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
});

// Modelo de Ingrediente
const IngredienteModel = sequelize.define('Ingrediente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sincronizar base de datos
sequelize.sync().then(() => { // Elimina { force: true }
  console.log('Base de datos sincronizada');
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});

// Rutas de Productos 
app.post('/server/productos', async (req, res) => {
  try {
    // Muestra los datos recibidos

    const { nombre, precio, descripcion, imagen, categorias, ingredientesOriginales, personalizable, isActive } = req.body;
    
    const categoriasArray = Array.isArray(categorias) ? categorias : [];
    const categoriasObj = categoriasArray.map(cat => new Category(cat.id, cat.nombre, cat.descripcion, cat.imgCategory, cat.isActive));
    const ingredientesOriginalesArray = Array.isArray(ingredientesOriginales) ? ingredientesOriginales : [];
    const ingredientesOriginalesObj = ingredientesOriginalesArray.map(ing => new Ingrediente(ing.id, ing.nombre, ing.cantidad, ing.type));
    const productData = {
      nombre,
      precio,
      descripcion,
      imagen: imagen || "",
      categorias: JSON.stringify(categoriasObj),
      ingredientesOriginales: JSON.stringify(ingredientesOriginalesObj),
      personalizable,
      isActive
    };
    const product = await Product.create(productData);
    res.status(201).send(product);
  } catch (error) {
    console.error('Error al guardar el producto:', error); // Agrega esta línea para registrar el error
    res.status(500).send({ message: 'Error al guardar el producto', error }); // Cambia el código de estado a 500
  }
});

app.get('/server/productos', async (req, res) => {
  try {
    const products = await Product.findAll();
    const modifiedProducts = products.map(product => {
      let categorias = product.dataValues.categorias;
      let ingredientesOriginales = product.dataValues.ingredientesOriginales;
      // Si categorias es un string (posiblemente serializado en la BD), conviértelo en array
      if (typeof categorias === "string") {
        try {
          categorias = JSON.parse(categorias);
        } catch (error) {
          console.error("❌ Error al convertir 'categorias':", error);
          categorias = []; // Si falla, aseguramos que sea un array vacío
        }
      }
      if (typeof ingredientesOriginales === "string") {
        try {
          ingredientesOriginales = JSON.parse(ingredientesOriginales);
        } catch (error) {
          console.error("❌ Error al convertir 'ingredientesOriginales':", error);
          ingredientesOriginales = []; // Si falla, aseguramos que sea un array vacío
        }
      }

      // Si sigue sin ser array, asegúrate de que lo sea
      if (!Array.isArray(categorias)) {
        categorias = [];
      }
      if (!Array.isArray(ingredientesOriginales)) {
        ingredientesOriginales = [];
      }

      return {
        ...product.dataValues,
        categorias: categorias.map(cat => new Category(cat.id, cat.nombre, cat.descripcion, cat.imgCategory, cat.isActive)),
        ingredientesOriginales: ingredientesOriginales.map(ing => new Ingrediente(ing.id, ing.nombre, ing.cantidad, ing.type))

      };
    });
    res.status(200).send(modifiedProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/server/productos/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const { nombre, precio, descripcion, imagen, categorias, ingredientesOriginales, personalizable, isActive } = req.body;
    
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      const categoriasObj = categoriasArray.map(cat => new Category(cat.id, cat.nombre, cat.descripcion, cat.imgCategory, cat.isActive));
      const ingredientesOriginalesArray = Array.isArray(ingredientesOriginales) ? ingredientesOriginales : [];
      const ingredientesOriginalesObj = ingredientesOriginalesArray.map(ing => new Ingrediente(ing.id, ing.nombre, ing.cantidad, ing.type));
      const productData = {
        nombre,
        precio,
        descripcion,
        imagen: imagen || "",
        categorias: JSON.stringify(categoriasObj),
        ingredientesOriginales: JSON.stringify(ingredientesOriginalesObj),
        personalizable,
        isActive
      };
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
    const productDelted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (productDelted) {
      res.status(200).send({ message: 'Producto eliminado' });
    } else {
      res.status(404).send({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/* 
/   Rutas de Categorías
/
*/
app.post('/server/categorias', async (req, res) => {
  try {
    const { nombre, descripcion, imagen, isActive } = req.body;
    const categoriaData = new Category(null, nombre, descripcion, imagen, isActive);
    const categoria = await Categoria.create(categoriaData);
    res.status(201).send(categoria);
  } catch (error) {
    console.error('Error al guardar la categoría:', error); // Agrega esta línea para registrar el error
    res.status(400).send({ message: 'Error al guardar la categoría', error });
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

app.put('/server/categorias/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (categoria) {
      const { nombre, descripcion, imagen, isActive } = req.body;
      const categoriaData = new Category(req.params.id, nombre, descripcion, imagen, isActive);
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
    const categoriasDeleted = await Categoria.destroy({
      where: { id: req.params.id },
    });
    if (categoriasDeleted) {
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
    const { nombre, cantidad, type } = req.body;
    const ingredienteData = new Ingrediente(null, nombre, cantidad, type);
    const ingrediente = await IngredienteModel.create(ingredienteData);
    res.status(201).send(ingrediente);
  } catch (error) {
    console.error('Error al guardar el ingrediente:', error); // Agrega esta línea para registrar el error
    res.status(400).send({ message: 'Error al guardar el ingrediente', error });
  }
});

app.get('/server/ingredientes', async (req, res) => {
  try {
    const ingredientes = await IngredienteModel.findAll();
    res.status(200).send(ingredientes);
  } catch (error) {
    console.error('Error al cargar los ingredientes:', error); // Agrega esta línea para registrar el error
    res.status(500).send({ message: 'Error al cargar los ingredientes', error });
  }
});

app.put('/server/ingredientes/:id', async (req, res) => {
  try {
    const ingrediente = await IngredienteModel.findByPk(req.params.id);
    if (ingrediente) {
      const { nombre, cantidad, type } = req.body;
      const ingredienteData = new Ingrediente(req.params.id, nombre, cantidad, type);
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
    const ingredienteDeled = await IngredienteModel.destroy({
      where: { id: req.params.id },
    });
    if (ingredienteDeled)
      res.status(200).send({ message: 'Ingrediente eliminado' });
     else 
      res.status(404).send({ message: 'Ingrediente no encontrado' });    
  } catch (error) {
    res.status(500).send(error);
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


/*
 *
 *  Usuarios
 * 
 */
app.post('/server/register', async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;
    if (!nombre || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { nombre } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      password: hashedPassword,
      rol,
    });

    res.status(201).json({ message: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});



app.post('/server/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;

    // Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { nombre } });

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña ingresada con la guardada en la base de datos
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: "2h" } // El token expira en 2 horas
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

const autenticarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  try {
    const verificado = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token no válido" });
  }
};


app.get('/server/perfil', autenticarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, { attributes: ['id', 'nombre','rol'] });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
});


/*
 *
 *  Peticiones a la API 
 * 
 */
// Send productos 
app.get('/api/productos', async (req, res) => {
  try {
    const products = await Product.findAll();
    const modifiedProducts = products.map(product => {
      let categorias = product.dataValues.categorias;
      let ingredientesOriginales = product.dataValues.ingredientesOriginales;
      // Si categorias es un string (posiblemente serializado en la BD), conviértelo en array
      if (typeof categorias === "string") {
        try {
          categorias = JSON.parse(categorias);
        } catch (error) {
          console.error("❌ Error al convertir 'categorias':", error);
          categorias = []; // Si falla, aseguramos que sea un array vacío
        }
      }
      if (typeof ingredientesOriginales === "string") {
        try {
          ingredientesOriginales = JSON.parse(ingredientesOriginales);
        } catch (error) {
          console.error("❌ Error al convertir 'ingredientesOriginales':", error);
          ingredientesOriginales = []; // Si falla, aseguramos que sea un array vacío
        }
      }

      // Si sigue sin ser array, asegúrate de que lo sea
      if (!Array.isArray(categorias)) {
        categorias = [];
      }
      if (!Array.isArray(ingredientesOriginales)) {
        ingredientesOriginales = [];
      }

      return {
        ...product.dataValues,
        categorias: categorias.map(cat => new Category(cat.id, cat.nombre, cat.descripcion, cat.imgCategory, cat.isActive)),
        ingredientesOriginales: ingredientesOriginales.map(ing => new Ingrediente(ing.id, ing.nombre, ing.cantidad, ing.type)),
        

      };
    });
    res.status(200).send(modifiedProducts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).send(categorias);
    

  } catch (error) {
    res.status(500).send(error);
  }
});

// IMAGENES AWT S3

// Configura la región (ajústala según tus necesidades)
AWS.config.update({ region: 'eu-north-1' });
const S3_BUCKET = 'img-my-order';

/* 
 * Rutas para AWS S3: Generar URL pre-firmada para subir y descargar imágenes
 */
app.get('/s3/generateUploadUrl', (req, res) => {
  const objectKey = req.query.key; // Por ejemplo: "uploads/imagen_usuario.jpg"
  if (!objectKey) {
    return res.status(400).json({ error: 'Falta el parámetro "key".' });
  }
  const s3 = new AWS.S3();
  const params = {
    Bucket: S3_BUCKET,
    Key: objectKey,
    Expires: 900, // URL válida por 15 minutos (900 segundos)
    // Se puede especificar el Content-Type, por ejemplo, 'image/jpeg'
    ContentType: req.query.contentType || 'image/jpeg'
  };
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error('Error generando la URL de subida:', err);
      return res.status(500).json({ error: 'Error generando la URL de subida' });
    }
    res.json({ uploadUrl: url });
  });
});

app.get('/s3/generateDownloadUrl', (req, res) => {
  const objectKey = req.query.key; // Por ejemplo: "uploads/imagen_usuario.jpg"
  if (!objectKey) {
    return res.status(400).json({ error: 'Falta el parámetro "key".' });
  }
  console.log("Key:", objectKey);
  const s3 = new AWS.S3();
  const params = {
    Bucket: S3_BUCKET,
    Key: objectKey,
    Expires: 900 // URL válida por 15 minutos
  };
  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error('Error generando la URL de descarga:', err);
      return res.status(500).json({ error: 'Error generando la URL de descarga' });
    }
    res.json({ downloadUrl: url });
  });
});
