const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
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
        // Test DB connection
        await sequelize.authenticate();
        console.log('Connected to reboul database..');

        // Sync DB with changes
        await sequelize.sync({ alter: true });

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
                server.close();
                startServer(PORT + 1);
            } else {
                console.error('Server error:', error);
            }
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();