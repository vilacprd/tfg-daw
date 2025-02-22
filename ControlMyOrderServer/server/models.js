import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
class Order{
    constructor(id, fecha, total, productos = [], anotacion, estado, mesa){
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.productos = productos;
        this.anotaciones = anotaciones;
        this.estado = estado;
        this.mesa = mesa;
    }
}

// Configurar __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear instancia de Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

// Definir el modelo de Usuario con Sequelize
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
  tableName: 'usuarios',
  timestamps: false,
});
  

export { sequelize,Ingrediente, Category, ProductoConnection, Usuario };
