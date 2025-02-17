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

export { Ingrediente, Category, ProductoConnection };
