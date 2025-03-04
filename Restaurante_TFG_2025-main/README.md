# Proyecto de Comandas para Restaurantes

Este proyecto es una aplicación **full-stack** para gestionar comandas de restaurante, combinando un **frontend en React** (con estilos en **Tailwind CSS**) y un **backend en Node.js/Express** (usando **Sequelize** para la base de datos). Permite **administrar productos**, **categorías**, **ingredientes** y ofrece una **interfaz sencilla** para el personal de sala y cocina.

---

## Características

- **Gestión de Productos**: Crear, editar y eliminar productos, con posibilidad de subir imágenes.  
- **Categorías**: Clasificar productos para mayor organización.  
- **Ingredientes**: Manejar ingredientes originales y extras, ajustando disponibilidad y stock.  
- **Personalizable**: Opción de personalizar platos, eligiendo ingredientes extra.  
- **Diseño Responsivo**: Interfaz adaptada a pantallas de distintos tamaños, gracias a Tailwind CSS.

---

## Tecnologías Principales

### Frontend:
- **React**  
- **Tailwind CSS**

### Backend:
- **Node.js**  
- **Express**  
- **Sequelize** para la base de datos.

**Base de Datos**: Compatible con Postgres, MySQL, SQLite u otras según tu configuración de Sequelize.

---

## Requisitos Previos

- **Node.js** (v16 o superior recomendado)  
- **npm** o **yarn** (gestor de paquetes)  
- Base de datos configurada (Postgres, MySQL, SQLite, etc.) según `db.js`.

---

## Instalación y Ejecución

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo

---

## Instalación y Ejecución

### Instalar dependencias
*(tanto en el servidor como en el cliente, si los tienes separados)*
werwe
```bash
npm install
```

## Configurar la base de datos

- En `db.js` (o en tus archivos de configuración) ajusta credenciales y el tipo de base de datos (MySQL, PostgreSQL, etc.).
- Asegúrate de que tu base de datos está accesible.

## Iniciar el servidor

```bash
npm start

```
- O si tu script es distinto:

```bash
node server.js

```

Se iniciará en [http://localhost:3000](http://localhost:3000) (por defecto).

## Arrancar el Frontend
*(si estás usando un proyecto React separado)*

```bash
cd client
npm install
npm start

```
Esto levantará el frontend en [http://localhost:3000](http://localhost:3000) o en un puerto alternativo si usas Vite o Create React App.


## Uso y Flujo de Trabajo

- **Ingreso de Productos**: Navega a la sección de productos en la interfaz. Puedes agregar el nombre, precio, descripción e imagen.
- **Clasificación en Categorías**: Asigna productos a diferentes categorías para organizarlos.
- **Ingredientes**: Administra ingredientes originales y extras.
- **Estado de Activación**: Marca como *Activo/Inactivo* los productos y categorías para ocultarlos temporalmente.
- **Búsqueda y Filtro**: Filtra productos por categoría, estado (activo) o busca por nombre.
  
## Estructura del Proyecto (Ejemplo)

```bash
├─ client/                 # Carpeta con el frontend en React (opcional)
│  ├─ src/
│  │  ├─ components/
│  │  ├─ ...
│  └─ package.json
├─ server.js               # Archivo principal del servidor (Node.js / Express)
├─ db.js                   # Configuración de Sequelize y modelos
├─ models/                 # Archivos de definición de modelos (opcional)
├─ routes/                 # Archivos de rutas para Express (opcional)
├─ uploads/                # Carpeta para imágenes subidas (usando multer)
├─ package.json
└─ README.md

```
 ## Contribuyendo

Fork a este repositorio y clona tu fork localmente.  
Crea una rama descriptiva, por ejemplo, `feature/nueva-funcionalidad`.  
Haz tus cambios y crea *commits* claros.  
Abre un *Pull Request* en este repositorio describiendo tus modificaciones.

## Contacto

Para dudas, sugerencias o reportes de bugs, abre un *Issue* en GitHub o contacta al equipo:

- **By Alejandro, Victor y Manu** - [@Manabimassu](https://github.com/Manabimassu)  
- Correo de contacto: `manuel12983@gmail.com` 
