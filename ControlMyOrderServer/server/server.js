import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Ingrediente, Category, ProductoConnection, Usuario } from './models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';

const app = express();
const port = 3000;
const SECRET_KEY = "claveSecreta";

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false, // Evita logs innecesarios
});

// =====================
//  MODELO DE MENSAJES
// =====================
const Mensaje = sequelize.define('Mensaje', {
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});



// ============================
//  OBTENER MENSAJES NO LEÍDOS
// ============================
app.get('/server/mensajes/noleidos', async (req, res) => {
  try {
    const mensajesNoLeidos = await Mensaje.count({ where: { leido: false } });
    res.json({ noLeidos: mensajesNoLeidos });
  } catch (error) {
    console.error("❌ Error al obtener mensajes no leídos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// ============================
//  MARCAR MENSAJES COMO LEÍDOS
// ============================
app.put('/server/mensajes/marcarLeidos', async (req, res) => {
  try {
    await Mensaje.update({ leido: true }, { where: { leido: false } });
    res.json({ message: "Mensajes marcados como leídos" });
  } catch (error) {
    console.error("❌ Error al marcar mensajes como leídos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// =============================
//  OBTENER TODOS LOS MENSAJES
// =============================
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

// =============================
//  ENVIAR NUEVO MENSAJE
// =============================
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

// Eliminar mensaje por ID
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

// ========================
//  REGISTER DE USUARIO
// ========================
app.post('/server/register', async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;

    // Validaciones simples
    if (!nombre || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Comprueba si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { nombre } });
    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      password: passwordHasheada,
      rol
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});


// =====================
//  LOGIN DE USUARIO
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

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

// Sincronizar base de datos sin eliminar los datos existentes
sequelize.sync({ alter: true })
  .then(() => console.log("📦 Base de datos sincronizada"))
  .catch((err) => console.error("❌ Error al sincronizar la BD:", err));