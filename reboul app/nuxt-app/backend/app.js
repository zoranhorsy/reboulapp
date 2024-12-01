require('dotenv').config();  // Ajouter au début
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3002;

// Configuration CORS pour production
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',  // URL de votre frontend sur Vercel
    credentials: true
}));

app.use(express.json());

// Gestion des uploads - à adapter pour le stockage en production
app.use('/uploads', express.static('public/uploads'));
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database..');

        // En production, on évite généralement le { alter: true }
        await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();