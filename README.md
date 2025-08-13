
ExpertSoft
## Description

ExpertSoft is a Node.js REST API for managing a library system, including clients, transactions, invoices, and platforms. It uses Express for the backend and MySQL for persistent data storage. The project is modular and includes seeders for easy database population.

## Main Features

- REST API for managing users, books, authors, and loans
- CSV seeders for populating the database
- MySQL database schema included
- Modular and organized code structure
- Error handling and clear API responses


## Project Structure

```
monolito/
├── docs/
│   ├── ExpertSoft_David_Vargas_Sierrapostman_collection # Postman collection
│   ├── Modulo4PruebaDesempeño   # MR
│   └── ExpertSoft_David_Vargas_Sierra.sql            # SQL schema
├── server/
│   ├── connection_db.js        # MySQL connection pool
│   ├── index.js                # Express API server
│   ├── data/                   # CSV data files
│   └── seeders/                # Scripts to load CSV data into DB
├── package.json
└── .gitignore
```

## Installation & Usage

1. **Clone the repository:**

   ```bash
   git clone <REPOSITORY_URL>
   cd ExpertSoft
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the database:**

   - Ensure MySQL is running.
   - Create the database and tables using the SQL script:

     ```bash
     mysql -u root -p < docs/ExpertSoft.sql
     ```

4. **Seed the database:**

   Run the seeders to populate the tables:

   ```bash
   node server/seeders/run_seeders.js
   ```

5. **Start the server:**

   ```bash
   node server/index.js
   ```

   The server will run at [http://localhost:3000](http://localhost:3000).

## API Endpoints

- `GET /` — Health check
- `GET /clients` — List all client
- `GET /clients/:id_client` — Get a specific clients
- `POST /clients` — Create a new client
- `PUT /clients/:id_client` — Update a client
- `DELETE /clients/:id_client` — Delete a client

### Advanced Queries

- `GET /total_amount/` -- Endpoint to get all clients with the total amount paid
- `GET /inv-transactions` -- Pending invoices and transaction id
- `GET /platformsbytransactions`--Transactions by platform 'Nequi'

## Notes

- The code is commented for easier understanding.
- Make descriptive commits for each feature.
- The project is not finished.

---

Thank you for reviewing the project!

## Coder Information

- **Name:** David Vargas
- **Clan:** Sierra
- **Email:** <davidvargas1224@gmail.com>
- **ID Document:** 1140893306
