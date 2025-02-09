class Ingrediente {
    constructor(id, nombre, cantidad, type) {
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.type = type;
    }
}

class Category {
    constructor(id, nombre = null, description = null, imgCategory, isActive = true) {
        this.id = id;
        this.nombre = nombre;
        this.description = description;
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
export { Ingrediente, Category, ProductoConnection };