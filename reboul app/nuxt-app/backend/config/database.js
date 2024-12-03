const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: 'reboul',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
});

// Test de connexion
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection successful');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;