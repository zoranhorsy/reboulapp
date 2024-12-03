const express = require('express');
const cors = require('cors');
const db = require('./models');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to reboul database..');

        await db.sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();