import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { dbQuery } from "./dbQuery.js";
dotenv.config();

let pool;

export const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        ca: process.env.MYSQL_SSL_CA, 
      },
    });

    const connection = await pool.getConnection();
    console.log("MySQL Connected:", connection.connection.config.host);
    connection.release();

    await createUsersTable();
    return pool;
  } catch (error) {
    console.error("MySQL Connection Failed:", error);
    process.exit(1);
  }
};

export const getDB = () => pool;

// Table creation function remains the same
const createUsersTable = async () => {
  await dbQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Localhost connection code
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// let pool;

// export const connectDB = async () => {
//   try {
//     pool = mysql.createPool({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     const connection = await pool.getConnection();
//     console.log("MySQL Connected:", connection.connection.config.host);
//     connection.release();

//     // Create users table if not exists
//     await createUsersTable();

//     return pool;
//   } catch (error) {
//     console.error("MySQL Connection Failed:", error);
//     process.exit(1);
//   }
// };

// export const getDB = () => pool;


// import { dbQuery } from "./dbQuery.js";

// const createUsersTable = async () => {
//   await dbQuery(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);

// };