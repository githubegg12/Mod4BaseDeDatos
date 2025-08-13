import fs from "fs"; // File system module to read files
import path from "path"; // Path module to handle file paths
import csv from "csv-parser"; // CSV parser to read CSV files
import { pool } from "../connection.js"; // Database connection pool

//Function to load data from transactions table to database
export async function loadTransactions() {
  const filePath = path.resolve("server/data/transactions.csv");
  const transactions = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        transactions.push([
            data.id_transaction,
            data.transaction_date,
            data.transaction_amount,
            data.transaction_state, 
            data.transaction_type,
            data.invoice_number,
            data.id_platform,
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `
            INSERT INTO transactions ( 
                id_transaction,
                transaction_date,
                transaction_amount,
                transaction_state, 
                transaction_type,
                invoice_number,
                id_platform) VALUES ?
                    `;
          const [result] = await pool.query(sql, [transactions]);
          console.log(
            `Inserted ${result.affectedRows} transactions into the database.`
          );
          resolve();
        } catch (error) {
          console.error(
            "Error inserting transactions into the database:",
            error.message
          );
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error(
          'Error reading the CSV file "transactions.csv":',
          error.message
        );
        reject(error);
      });
  });
}
