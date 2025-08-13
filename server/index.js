import express from "express";
import cors from "cors";
import { pool } from "./connection.js"; // Import the database connection pool

const app = express();
app.use(cors()); // Enable cors to work with frontend applications
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("Server online"); // This is the root endpoint
});

/* *************** */
/*    CRUD      */
app.get("/clients", async (req, res) => {
  // Endpoint to get a specific client information by id
  try {
    const query = `
      select clients.id_client,
      clients.client_name,
      clients.client_identification,
      invoices.invoice_number,
      invoices.amount_paid,
      transactions.id_transaction,
      transactions.transaction_state
      from clients join invoices on clients.id_client =invoices.id_client
      join transactions on transactions.invoice_number=invoices.invoice_number
      join platforms on transactions.id_platform = platforms.id_platform ;
    `;
    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.get("/clients/:id_client", async (req, res) => {
  // Endpoint to get a specific client information by id
  const { id_client } = req.params;
  try {
    const query = `
      select clients.id_client,
      clients.client_name,
      clients.client_identification,
      invoices.invoice_number,
      invoices.amount_paid,
      transactions.id_transaction,
      transactions.transaction_state
      from clients join invoices on clients.id_client =invoices.id_client
      join transactions on transactions.invoice_number=invoices.invoice_number
      join platforms on transactions.id_platform = platforms.id_platform where clients.id_client = ? ;
    `;
    const [rows] = await pool.query(query, id_client);
    if (rows.length === 0) {
      return res.json({ error: "Client can not be found" });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.post("/clients", async (req, res) => {
  // Endpoint to create a new client
  const { client_name, client_identification, address, cellphone, email } =
    req.body;
  try {
    const query = `INSERT INTO clients ( 
                            client_name,
                            client_identification,
                            address, 
                            cellphone,
                            email) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [
      client_name,
      client_identification,
      address,
      cellphone,
      email,
    ]);
    return res.status(201).json({
      message: "Client created successfully",
      id_prestamo: result.insertId,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.put("/clients/:id_client", async (req, res) => {
  // Endpoint to update a client information by id_client
  const { id_client } = req.params;
  const { client_name, client_identification, address, cellphone, email } =
    req.body;
  try {
    const query = `UPDATE clients SET client_name = ? , client_identification  = ?, address = ?, cellphone = ?, email = ? WHERE id_client = ? `;
    const [result] = await pool.query(query, [
      client_name,
      client_identification,
      address,
      cellphone,
      email,
      id_client,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client can not be found" });
    }
    return res.json({ message: "Client updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.delete("/clients/:id_client", async (req, res) => {
  // Endpoint to delete a client information by id
  const { id_client } = req.params;
  try {
    const query = `DELETE FROM clients WHERE id_client = ?`;
    const [result] = await pool.query(query, id_client);

    confirm(result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Client can not found" });
    }
    return res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

/* ************************* */
/*    Advance queries     */

app.get("/total_amount/", async (req, res) => {
  // Endpoint to get all clients with the total amount paid
  try {
    const query = ` SELECT clients.id_client,
    clients.client_name ,
    clients.client_identification,
    SUM(invoices.amount_paid) as total_amount
    from clients join invoices on clients.id_client=invoices.id_client
    GROUP BY clients.id_client,clients.client_name;
      `;
    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Pending invoices and transaction id
app.get("/invoices/inv-transactions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
           SELECT clients.client_name,
    clients.cellphone,
    clients.address,
    transactions.id_transaction,
    transactions.transaction_state
    FROM clients JOIN invoices on clients.id_client = invoices.id_client
    join transactions on transactions.invoice_number=invoices.invoice_number;`);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// Transactions by platform 'Nequi'
app.get("/platformsbytransactions", async (req, res) => {
  try {
    const [rows] = await pool.query(`
          select 
          clients.id_client,
          clients.client_name,
          transactions.invoice_number,
          invoices.amount_paid,
          transactions.id_transaction,
          platforms.platform_name
          from clients join invoices on clients.id_client =invoices.id_client
          join transactions on transactions.invoice_number=invoices.invoice_number
          join platforms on transactions.id_platform = platforms.id_platform
          WHERE platforms.platform_name= 'Nequi';`);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

const router = express.Router();

export default router;

app.listen(3000, () => {
  // Start the server on port 3000
  console.log("Server is running on http://localhost:3000");
});
