import fs from 'fs'; // File system module to read files
import path from 'path'; // Path module to handle file paths
import csv from 'csv-parser'; // CSV parser to read CSV files
import {pool} from '../connection.js'; // Database connection pool

//Function to load data from platforms table to database
export async function loadPlatforms() {
    const filePath = path.resolve('server/data/platforms.csv');
    const platforms = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                platforms.push([
                    data.platform_name,
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = `
                        INSERT INTO platforms( 
                            platform_name) VALUES ?
                    `;
                    const [result]= await pool.query(sql, [platforms]);
                    console.log(`Inserted ${result.affectedRows} platforms into the database.`);
                    resolve();
                } catch (error) {
                    console.error('Error inserting platforms into the database:', error.message);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading the CSV file "platforms.csv":', error.message);
                reject(error);
            });
    })
}
