const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Au lieu d'un simple tableau de tailles, on stocke un objet avec les stocks
    sizeStock: {
        type: DataTypes.JSONB,
        defaultValue:
        // Exemple de structure:
         { "S": 10, "M": 5, "L": 0, "XL": 3 },
    }
});

module.exports = Product;