'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la tabla de respaldo si existe
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS ProductoCategoria_backup;');
    
    await queryInterface.createTable('ProductoCategoria', {
      productoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Ajusta según el nombre real de la tabla de Producto
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categoria', // Asegúrate de que coincide con el nombre real de la tabla de Categoria
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // Agregar restricción única compuesta
    await queryInterface.addConstraint('ProductoCategoria', {
      fields: ['productoId', 'categoriaId'],
      type: 'unique',
      name: 'unique_producto_categoria'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductoCategoria');
  }
};
