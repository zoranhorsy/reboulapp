const db = require('../models');
const Product = db.Product;

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, categories, sizeStock } = req.body;

        if (!name || !price || !categories?.length) {
            return res.status(400).json({
                message: "Données incomplètes"
            });
        }

        const product = await Product.create({
            name,
            price,
            description,
            categories,
            sizeStock: sizeStock || { "S": 0, "M": 0, "L": 0, "XL": 0 }
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            message: "Erreur création produit",
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, categories, sizeStock } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Produit non trouvé"
            });
        }

        await product.update({
            name,
            price,
            description,
            categories,
            sizeStock
        });

        res.json(await product.reload());
    } catch (error) {
        res.status(400).json({
            message: "Erreur mise à jour",
            error: error.message
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll(); // Vérifiez la requête Sequelize ici
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json(product);
    } catch (error) {
        console.error('Erreur récupération produit:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération du produit",
            details: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        await product.destroy();
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        console.error('Erreur suppression produit:', error);
        res.status(500).json({
            message: "Erreur lors de la suppression du produit",
            details: error.message
        });
    }
};