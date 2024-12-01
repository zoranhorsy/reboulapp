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
    sizeStock: {
        type: DataTypes.JSONB,
        defaultValue: { "S": 0, "M": 0, "L": 0, "XL": 0 },
        // Format: { "S": 10, "M": 5, "L": 0, "XL": 3 }
        get() {
            const rawValue = this.getDataValue('sizeStock');
            return rawValue || {};
        }
    }
});

// Méthodes d'instance utiles
Product.prototype.getTotalStock = function() {
    return Object.values(this.sizeStock).reduce((sum, qty) => sum + (qty || 0), 0);
};

Product.prototype.checkSizeAvailability = function(size) {
    return this.sizeStock[size] > 0;
};

module.exports = Product;