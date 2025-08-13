import fs from "fs"; // File system module to read files
import path from "path"; // Path module to handle file paths
import csv from "csv-parser"; // CSV parser to read CSV files
import { pool } from "../connection.js"; // Database connection pool

//Function to load data from invoices table to database
export async function loadInvoices() {
  const filePath = path.resolve("server/data/invoices.csv");
  const invoices = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        invoices.push([
          data.invoice_number,
          data.invoice_period,
          data.invoice_amount,
          data.amount_paid,
          data.id_client,
        ]);
      })
      .on("end", async () => {
        try {
            const sql = `
                INSERT INTO invoices ( 
                    invoice_number,
                    invoice_period,
                    invoice_amount,
                    amount_paid,
                    id_client) VALUES ?
                `;
          const [result] = await pool.query(sql, [invoices]);
          console.log(
            `Inserted ${result.affectedRows} invoices into the database.`
          );
          resolve();
        } catch (error) {
          console.error(
            "Error inserting invoices into the database:",
            error.message
          );
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error(
          'Error reading the CSV file "invoices.csv":',
          error.message
        );
        reject(error);
      });
  });
}
