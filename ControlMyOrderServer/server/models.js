// models.js

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
  logging: false, // Desactiva logs en consola, si prefieres
});

// =====================
//   Modelo Usuario
// =====================
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

// =====================
//   Modelo Ingrediente
// =====================
const Ingrediente = sequelize.define('Ingrediente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Si subes imágenes y guardas el nombre del archivo
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// =====================
//   Modelo Category
// =====================
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
});

// ===============================
//   Modelo ProductoConnection
// ===============================
const ProductoConnection = sequelize.define('ProductoConnection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  personalizable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: false,
});

// =====================
//   Modelo Mensaje
// =====================
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
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
});

// ==================================
//   Clases JavaScript (opcional)
// ==================================
class IngredienteClass {
  constructor(id, nombre, cantidad, type) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.type = type;
  }
}

class CategoryClass {
  constructor(id, nombre = null, descripcion = null, imgCategory, isActive = true) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imgCategory = imgCategory;
    this.isActive = isActive;
  }
}

class ProductoConnectionClass {
  constructor(
    id,
    nombre,
    precio,
    descripcion,
    imagen,
    cantidad,
    categorias = [],
    ingredientesOriginales = [],
    ingredientesExtras = [],
    isPersonalizable,
    isActived
  ) {
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

// **Sincronizar la base de datos y crear las tablas si no existen**
sequelize.sync({alter: true})
  .then(() => console.log("📦 Base de datos recreada / actualizada correctamente"))
  .catch((err) => console.error("❌ Error al sincronizar la base de datos:", err));

// **Exportar todos los modelos y (opcional) las clases**
export {
  sequelize,
  Usuario,
  Ingrediente,         // Modelo Sequelize (Ingrediente.create(...))
  Category,            // Modelo Sequelize (Category.create(...))
  ProductoConnection,  // Modelo Sequelize (ProductoConnection.create(...))
  Mensaje,
  // Clases JavaScript (si las necesitas)
  IngredienteClass,
  CategoryClass,
  ProductoConnectionClass
};
