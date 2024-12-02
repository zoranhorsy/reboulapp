const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        // Valider les données entrantes
        const { name, price, description, category, sizeStock } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({
                message: "Données manquantes",
                details: "Le nom, le prix et la catégorie sont requis"
            });
        }

        // Valider le format du sizeStock
        if (sizeStock && typeof sizeStock !== 'object') {
            return res.status(400).json({
                message: "Format invalide",
                details: "sizeStock doit être un objet"
            });
        }

        // Nettoyer les valeurs du stock
        const cleanSizeStock = {};
        if (sizeStock) {
            Object.entries(sizeStock).forEach(([size, quantity]) => {
                cleanSizeStock[size] = Math.max(0, parseInt(quantity) || 0);
            });
        }

        const product = await Product.create({
            ...req.body,
            sizeStock: cleanSizeStock
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Erreur création produit:', error);
        res.status(400).json({
            message: "Erreur lors de la création du produit",
            details: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });

        const { sizeStock, categories, ...otherData } = req.body;

        const updateData = {
            ...otherData,
            categories: categories || [],
            sizeStock: sizeStock ? Object.entries(sizeStock).reduce((acc, [size, quantity]) => {
                acc[size] = Math.max(0, parseInt(quantity) || 0);
                return acc;
            }, {}) : {}
        };

        await product.update(updateData);
        const updatedProduct = await Product.findByPk(req.params.id);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Erreur mise à jour produit:', error);
        res.status(400).json({ message: "Erreur lors de la mise à jour", details: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Erreur récupération produits:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération des produits",
            details: error.message
        });
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