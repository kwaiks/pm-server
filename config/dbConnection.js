const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    host: '34.101.236.191',
    port: 5432,
    database: 'postgres',
    password: 'iot2020'
});

module.exports = db;