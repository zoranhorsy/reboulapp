module.exports = (sequelize, DataTypes) => {
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
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        categories: {
            type: DataTypes.JSONB,
            defaultValue: [],
            allowNull: false
        },
        sizeStock: {
            type: DataTypes.JSONB,
            defaultValue: { "S": 0, "M": 0, "L": 0, "XL": 0 }
        }
    });

    return Product;
};