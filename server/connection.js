import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: "localhost",
    database:"ExpertSoft_David_Vargas_Sierra",
    port: "3306",
    user: "davidv",
    password: "riwicol12",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
})

async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to the database successfully!");
        connection.release();
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connect()
