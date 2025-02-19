// models.js

import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === Conexión Sequelize con SQLite ===
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false, 
});

/*
  TABLAS QUE DESEAS MANTENER:
  - Categoria      (tabla exacta: "Categoria")
  - Ingredientes   (tabla exacta: "Ingredientes")
  - Mensajes       (tabla exacta: "Mensajes")
  - Products       (tabla exacta: "Products")
  - usuarios       (tabla exacta: "usuarios")
*/

// =====================
//   Modelo Usuario
//   Mapea a la tabla "usuarios"

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
  tableName: 'usuarios', // Usa la tabla ya existente
  timestamps: false,
});

// =====================
//   Modelo Categoria
//   Mapea a la tabla "Categoria"

const Categoria = sequelize.define('Categoria', {  
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
  tableName: 'Categoria',
   freezeTableName: true,
  timestamps: false,
});

// =====================
//   Modelo Ingrediente
//   Mapea a la tabla "Ingredientes"
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
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Ingredientes', // Usa la tabla "Ingredientes"
  timestamps: false,
});

// =====================
//   Modelo Mensaje
//   Mapea a la tabla "Mensajes"
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
  tableName: 'Mensajes', // Usa la tabla "Mensajes"
  timestamps: false,
});

// =====================
//   Modelo Producto
//   Mapea a la tabla "Products"
const Producto = sequelize.define('Producto', {
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
  tableName: 'Products', // Usa la tabla "Products"
  timestamps: false,
});

// =====================
//   Asociaciones (Muchos a Muchos)
// =====================

// Asociación Producto - Categoria
Producto.belongsToMany(Categoria, {
  through: 'ProductoCategoria',
  as: 'categorias', // Alias para que se genere getCategorias, setCategorias, etc.
  foreignKey: 'productoId',
  otherKey: 'categoriaId'
});
Categoria.belongsToMany(Producto, {
  through: 'ProductoCategoria',
  as: 'productos', // Alias para el otro lado (opcional)
  foreignKey: 'categoriaId',
  otherKey: 'productoId'
});

// Asociación Producto - Ingrediente
Producto.belongsToMany(Ingrediente, {
  through: 'ProductoIngrediente',
  as: 'ingredientes',
  foreignKey: {
    name: 'productoId',
    unique: false, // Asegura que no se establezca un índice único en este campo
  },
  otherKey: 'ingredienteId'
});
Ingrediente.belongsToMany(Producto, {
  through: 'ProductoIngrediente',
  as: 'productos',
  foreignKey: {
    name: 'ingredienteId',
    unique: false,
  },
  otherKey: 'productoId'
});


// =====================
//   Clases JavaScript (opcional)
// =====================

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

class ProductoClass {
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

// =====================
//   Sincronizar DB
// =====================
//sequelize.sync({ force: true })
//  .then(() => console.log("📦 Base de datos sincronizada correctamente"))
// .catch((err) => console.error("❌ Error al sincronizar la BD:", err));

// =====================
//   Exportar
// =====================
export {
  sequelize,
  Usuario,
  Categoria,
  Ingrediente,
  Mensaje,
  Producto,
  // Clases JavaScript (si las necesitas)
  IngredienteClass,
  CategoryClass,
  ProductoClass
};
