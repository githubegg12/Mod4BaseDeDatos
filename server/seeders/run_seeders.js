import { loadClients } from './load_clients.js'; // Import the loadClientas function
import { loadPlatforms } from './load_platforms.js'; // Import the loadPlatforms function
import { loadInvoices } from './load_invoices.js'; // Import the loadInvoices function
import { loadTransactions } from './load_transactions.js'; // Import the loadTransactions function

(async () => {
    try {
        console.log('Starting to load tables...');
        await loadClients();
        await loadPlatforms();
        await loadInvoices();
        await loadTransactions();
        console.log('Tables loaded successfully.');
    } catch (error) {
        console.error('Error loading Table information:', error.message);
    }finally {
        process.exit(); // Exit the process after loading tables
    }
})();
