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
import multer from 'multer';

// Importar modelos
import {
  sequelize,
  Usuario,
  Ingrediente,
  Categoria,
  Producto,
  Mensaje
} from './models.js';

const app = express();
const port = 3000;
const SECRET_KEY = "claveSecreta";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir archivos estáticos, si subes imágenes a /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Importar el router de productos (asegúrate de que 'routes/productos.js' existe y utiliza ESM)
import productosRouter from './routes/productos.js';

// Monta el router en la ruta /server/productos
app.use('/server/productos', productosRouter);


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

app.post('/server/register', async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;
    // Validar que se hayan enviado todos los datos
    if (!nombre || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    // Verificar si ya existe el usuario
    const existe = await Usuario.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    // Generar el hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      password: hashedPassword,
      rol,
    });
    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});


// =====================
//  CATEGORÍAS
// =====================
app.get('/server/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
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

    const nuevaCat = await Categoria.create({
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
    const cat = await Categoria.findByPk(id);
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
    const cat = await Categoria.findByPk(id);
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
app.get('/server/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categorias' },
        { model: Ingrediente, as: 'ingredientes' }
      ]
    });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});




app.post('/server/productos', upload.single('imagen'), async (req, res) => {
  try {
    const {
      nombre,
      precio,
      descripcion,
      personalizable,
      isActive,
      categorias,            // Ejemplo: '["Ensaladas"]'
      ingredientesOriginales // Ejemplo: '["Tomate"]'
    } = req.body;

    console.log("Datos del request:", req.body);

    let fileName = null;
    if (req.file) {
      fileName = req.file.filename;
    }

    const parsedPrecio = parseFloat(precio) || 0;
    const isPers = personalizable === 'true' || personalizable === true;
    const isAct = isActive === 'true' || isActive === true;

    // Crear el producto
    const nuevoProducto = await Producto.create({
      nombre,
      precio: parsedPrecio,
      descripcion,
      imagen: fileName,
      personalizable: isPers,
      isActive: isAct,
    });

    // Procesar y asignar categorías
    if (categorias) {
      // Convertir la cadena JSON a un arreglo
      let categoriasArray = typeof categorias === 'string' ? JSON.parse(categorias) : categorias;
      console.log('categoriasArray (nombres):', categoriasArray);

      const categoriasIds = [];
      for (const nombreCategoria of categoriasArray) {
        const categoria = await Categoria.findOne({ where: { nombre: nombreCategoria } });
        if (categoria) {
          categoriasIds.push(categoria.id);
        } else {
          console.warn(`No se encontró la categoría con nombre: ${nombreCategoria}`);
        }
      }
      console.log('categoriasIds (IDs):', categoriasIds);
      if (categoriasIds.length > 0) {
        await nuevoProducto.setCategorias(categoriasIds);
      }
    }

    // Procesar y asignar ingredientes (similar al de categorías)
    if (ingredientesOriginales) {
      let ingredientesArray = typeof ingredientesOriginales === 'string'
        ? JSON.parse(ingredientesOriginales)
        : ingredientesOriginales;
      console.log('ingredientesArray (nombres):', ingredientesArray);

      const ingredientesIds = [];
      for (const nombreIngrediente of ingredientesArray) {
        const ingrediente = await Ingrediente.findOne({ where: { nombre: nombreIngrediente } });
        if (ingrediente) {
          ingredientesIds.push(ingrediente.id);
        } else {
          console.warn(`No se encontró el ingrediente con nombre: ${nombreIngrediente}`);
        }
      }
      console.log('ingredientesIds (IDs):', ingredientesIds);
      if (ingredientesIds.length > 0) {
        await nuevoProducto.setIngredientes(ingredientesIds);
      }
    }

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});


app.put('/server/productos/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Producto.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const {
      nombre,
      precio,
      descripcion,
      personalizable,
      isActive,
      categorias,    // Se espera que venga como array de IDs o array de objetos con propiedad "id"
      ingredientes   // Igual para ingredientes
    } = req.body;

    let fileName = product.imagen;
    if (req.file) {
      fileName = req.file.filename;
    }

    const parsedPrecio = parseFloat(precio) || 0;
    const isPers = (personalizable === 'true' || personalizable === true);
    const isAct = (isActive === 'true' || isActive === true);

    product.nombre = nombre;
    product.precio = parsedPrecio;
    product.descripcion = descripcion;
    product.imagen = fileName;
    product.personalizable = isPers;
    product.isActive = isAct;

    await product.save();

    // Función auxiliar para convertir cualquier input a array de IDs numéricos
    const convertToIdArray = (input) => {
      // Si no es un array, lo convertimos en array
      let arr = Array.isArray(input) ? input : [input];
      console.log("Contenido original:", JSON.stringify(arr));
      return arr.map(item => {
        if (item && typeof item === 'object') {
          if ('id' in item) {
            return Number(item.id);
          } else {
            console.error("El objeto no tiene propiedad 'id':", item);
            return null;
          }
        }
        return Number(item);
      }).filter(x => x !== null && !isNaN(x));
    };

    // Actualizar asociaciones de categorías
    if (categorias) {
      let categoriasArray;
      if (typeof categorias === 'string') {
        try {
          categoriasArray = JSON.parse(categorias);
        } catch (err) {
          console.error("Error al parsear 'categorias':", err);
          categoriasArray = [];
        }
      } else {
        categoriasArray = categorias;
      }
      const catIds = convertToIdArray(categoriasArray);
      console.log("Array final para setCategorias:", catIds);
      await product.setCategorias(catIds);
    }

    // Actualizar asociaciones de ingredientes
    if (ingredientes) {
      let ingredientesArray;
      if (typeof ingredientes === 'string') {
        try {
          ingredientesArray = JSON.parse(ingredientes);
        } catch (err) {
          console.error("Error al parsear 'ingredientes':", err);
          ingredientesArray = [];
        }
      } else {
        ingredientesArray = ingredientes;
      }
      const ingIds = convertToIdArray(ingredientesArray);
      console.log("Array final para setIngredientes:", ingIds);
      await product.setIngredientes(ingIds);
    }

    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});


app.delete('/server/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Producto.findByPk(id);
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
