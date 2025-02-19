'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductoIngrediente', {
      productoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Asegúrate de que coincide con el nombre de la tabla de Producto
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ingredienteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ingredientes', // Asegúrate de que coincide con el nombre de la tabla de Ingrediente
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
    await queryInterface.addConstraint('ProductoIngrediente', {
      fields: ['productoId', 'ingredienteId'],
      type: 'unique',
      name: 'unique_producto_ingrediente'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductoIngrediente');
  }
};
