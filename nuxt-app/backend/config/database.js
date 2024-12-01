const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: 'reboul',
    username: process.env.USER,
    password: '',
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log // Ajout du logging
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