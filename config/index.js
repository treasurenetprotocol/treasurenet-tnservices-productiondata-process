/**
 * Create with productiondataprocess
 * Author: ChrisChiu
 * Date: 2023/9/21
 * Desc
 */
require('dotenv').config();

module.exports = {
    mssql: {
        user: process.env.MSSQL_DATABASE_USER,
        password: process.env.MSSQL_DATABASE_PASSWORD,
        database: process.env.MSSQL_DATABASE_DBNAME,
        server: process.env.MSSQL_DATABASE_SERVER,
        options: {
            trustServerCertificate: true,
            port: process.env.MSSQL_DATABASE_PORT,
        }
    },
    mssql_tableName: process.env.MSSQL_DATABASE_TABLE,
    mongodb: {
        replicaSet: process.env.MONGO_REPLICASET_NAME || false,
        host: process.env.MONGO_HOST,
        database: process.env.MONGO_NAME,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PWD,
        DB_URL: process.env.MONGO_URL || ""
    }
}
