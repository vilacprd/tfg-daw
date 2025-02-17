// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
// Multer para procesar archivos
import multer from 'multer';

// Importar tus modelos *CORREGIDOS*
import {
  sequelize,
  Usuario,
  Ingrediente,         // ¡Este es el modelo Sequelize para ingredientes!
  Category,
  ProductoConnection,
  Mensaje
} from './models.js';

const app = express();
const port = 3000;
const SECRET_KEY = "claveSecreta";

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir archivos estáticos, si subes imágenes a /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// =====================
//  MENSAJES
// =====================
app.get('/server/mensajes/noleidos', async (req, res) => {
  try {
    const mensajesNoLeidos = await Mensaje.count({ where: { leido: false } });
    res.json({ noLeidos: mensajesNoLeidos });
  } catch (error) {
    console.error("❌ Error al obtener mensajes no leídos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.put('/server/mensajes/marcarLeidos', async (req, res) => {
  try {
    await Mensaje.update({ leido: true }, { where: { leido: false } });
    res.json({ message: "Mensajes marcados como leídos" });
  } catch (error) {
    console.error("❌ Error al marcar mensajes como leídos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.get('/server/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.findAll({
      order: [['fecha', 'DESC']],
    });
    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.post('/server/mensajes', async (req, res) => {
  try {
    const { contenido, autor } = req.body;
    if (!contenido || !autor) {
      return res.status(400).json({ message: "Contenido y autor son obligatorios" });
    }
    const nuevoMensaje = await Mensaje.create({ contenido, autor, leido: false });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.delete('/server/mensajes/:id', async (req, res) => {
  try {
    const mensajeId = req.params.id;
    const mensaje = await Mensaje.findByPk(mensajeId);
    if (!mensaje) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    await mensaje.destroy();
    res.json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar mensaje:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// =====================
//  LOGIN
// =====================
app.post('/server/login', async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const usuario = await Usuario.findOne({ where: { nombre } });

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// =====================
//  CATEGORÍAS
// =====================
app.get('/server/categorias', async (req, res) => {
  try {
    const categorias = await Category.findAll();
    res.json(categorias);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.post('/server/categorias', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, isActive } = req.body;
    let fileName = null;
    if (req.file) {
      fileName = req.file.filename; // Nombre del archivo subido
    }
    const activeBool = (isActive === 'true' || isActive === true);

    const nuevaCat = await Category.create({
      nombre,
      descripcion,
      isActive: activeBool,
      imagen: fileName
    });
    res.status(201).json(nuevaCat);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.put('/server/categorias/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const { nombre, descripcion, isActive } = req.body;
    let fileName = cat.imagen;
    if (req.file) {
      fileName = req.file.filename;
    }
    cat.nombre = nombre;
    cat.descripcion = descripcion;
    cat.isActive = (isActive === 'true' || isActive === true);
    cat.imagen = fileName;

    await cat.save();
    res.json({ message: "Categoría actualizada exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.delete('/server/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    await cat.destroy();
    res.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// =====================
//  INGREDIENTES
// =====================
app.get('/server/ingredientes', async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    console.error("❌ Error al obtener ingredientes:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.post('/server/ingredientes', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, type, cantidad } = req.body;
    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }
    const cantNum = parseFloat(cantidad) || 0;

    const nuevoIngrediente = await Ingrediente.create({
      nombre,
      type,
      cantidad: cantNum,
      imagen: fileName
    });
    res.status(201).json(nuevoIngrediente);
  } catch (error) {
    console.error("❌ Error al crear ingrediente:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.put('/server/ingredientes/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const ingrediente = await Ingrediente.findByPk(id);
    if (!ingrediente) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    const { nombre, type, cantidad } = req.body;
    let fileName = ingrediente.imagen;
    if (req.file) {
      fileName = req.file.filename;
    }
    const cantNum = parseFloat(cantidad) || 0;

    ingrediente.nombre = nombre;
    ingrediente.type = type;
    ingrediente.cantidad = cantNum;
    ingrediente.imagen = fileName;

    await ingrediente.save();
    res.json({ message: "Ingrediente actualizado exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar ingrediente:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.delete('/server/ingredientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ingrediente = await Ingrediente.findByPk(id);
    if (!ingrediente) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }
    await ingrediente.destroy();
    res.json({ message: "Ingrediente eliminado exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar ingrediente:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// =====================
//  PRODUCTOS
// =====================
app.get('/server/productos', async (req, res) => {
  try {
    const productos = await ProductoConnection.findAll();
    res.json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.post('/server/productos', upload.single('imagen'), async (req, res) => {
  try {
    const {
      nombre,
      precio,
      descripcion,
      personalizable,
      isActive
      // categorías, ingredientes, etc. si lo deseas
    } = req.body;

    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }

    const parsedPrecio = parseFloat(precio) || 0;
    const isPers = personalizable === 'true' || personalizable === true;
    const isAct = isActive === 'true' || isActive === true;

    const nuevoProducto = await ProductoConnection.create({
      nombre,
      precio: parsedPrecio,
      descripcion,
      imagen: fileName,
      personalizable: isPers,
      isActive: isAct,
    });

    // Si quisieras setear categorías o ingredientes en relaciones, hazlo aquí

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.put('/server/productos/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductoConnection.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const {
      nombre,
      precio,
      descripcion,
      personalizable,
      isActive
    } = req.body;

    let fileName = product.imagen;
    if (req.file) {
      fileName = req.file.filename;
    }

    const parsedPrecio = parseFloat(precio) || 0;
    const isPers = personalizable === 'true' || personalizable === true;
    const isAct = isActive === 'true' || isActive === true;

    product.nombre = nombre;
    product.precio = parsedPrecio;
    product.descripcion = descripcion;
    product.imagen = fileName;
    product.personalizable = isPers;
    product.isActive = isAct;

    await product.save();
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

app.delete('/server/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductoConnection.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    await product.destroy();
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// ===========================
//  ARRANCAR EL SERVIDOR
// ===========================
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

// Sincronizar base de datos (si no se hace en models.js) – OPCIONAL
// sequelize.sync({ alter: true })
//   .then(() => console.log("📦 BD sincronizada"))
//   .catch((err) => console.error("❌ Error al sincronizar la BD:", err));
