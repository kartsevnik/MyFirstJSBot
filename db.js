const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    'tgbot',
    'root',
    'Aj{sx#8cJUf/JJDh',
    {
        host: '34.22.146.115',
        port: '5432',
        dialect: 'postgres'
    }
)