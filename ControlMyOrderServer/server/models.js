import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// **Conectar a SQLite con Sequelize**
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

// **Modelo de Usuario**
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'encargado', 'camarero'),
    allowNull: false,
    defaultValue: 'camarero',
  },
}, {
  timestamps: false,
});
  


class Ingrediente {
  constructor(id, nombre, cantidad, type) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.type = type;
  }
}

class Category {
  constructor(id, nombre = null, descripcion = null, imgCategory, isActive = true) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imgCategory = imgCategory;
    this.isActive = isActive;
  }
}

class ProductoConnection {
  constructor(id, nombre, precio, descripcion, imagen, cantidad, categorias = [], ingredientesOriginales = [], ingredientesExtras = [], isPersonalizable, isActived) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.cantidad = cantidad;
    this.categorias = categorias;
    this.ingredientesOriginales = ingredientesOriginales;
    this.ingredientesExtras = ingredientesExtras;
    this.isPersonalizable = isPersonalizable;
    this.isActived = isActived;
  }
}

const Mensaje = sequelize.define('Mensaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  leido: {   // ✅ Nuevo campo para identificar mensajes leídos o no leídos
    type: DataTypes.BOOLEAN,
    defaultValue: false, // 🚀 Todos los mensajes nuevos estarán sin leer
  },
});

// **Sincronizar la base de datos y crear las tablas si no existen**
sequelize.sync({})
  .then(() => console.log("📦 Base de datos recreada correctamente"))
  .catch((err) => console.error("❌ Error al sincronizar la base de datos:", err));

// **Exportar Modelos**
export { sequelize, Usuario, Ingrediente, Category, ProductoConnection };
