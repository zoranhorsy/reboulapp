exports.validateStock = (sizeStock) => {
    if (!sizeStock || typeof sizeStock !== 'object') {
        return false;
    }

    return Object.values(sizeStock).every(qty =>
        Number.isInteger(qty) && qty >= 0
    );
};

exports.updateStockForSize = async (product, size, quantity) => {
    if (!product.sizeStock[size] || product.sizeStock[size] < quantity) {
        throw new Error('Stock insuffisant');
    }

    product.sizeStock[size] -= quantity;
    await product.save();

    return product;
};