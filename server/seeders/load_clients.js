import fs from 'fs'; // File system module to read files
import path from 'path'; // Path module to handle file paths
import csv from 'csv-parser'; // CSV parser to read CSV files
import {pool} from '../connection.js'; // Database connection pool

//Function to load data from clients table to database
export async function loadClients() {
    const filePath = path.resolve('server/data/clients.csv');
    const clients = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                clients.push([
                    data.client_name,
                    data.client_identification,
                    data.address,
                    data.cellphone,
                    data.email
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = `
                        INSERT INTO clients ( 
                            client_name,
                            client_identification,
                            address, 
                            cellphone,
                            email) VALUES ?
                    `;
                    const [result]= await pool.query(sql, [clients]);
                    console.log(`Inserted ${result.affectedRows} clients into the database.`);
                    resolve();
                } catch (error) {
                    console.error('Error inserting clients into the database:', error.message);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading the CSV file "clients.csv":', error.message);
                reject(error);
            });
    })
}
