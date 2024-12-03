const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/api/products/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await sequelize.query(
            'UPDATE "Products" SET status = $1 WHERE id = $2',
            {
                bind: [status, id],
                type: sequelize.QueryTypes.UPDATE
            }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;