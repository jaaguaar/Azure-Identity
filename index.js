const { DefaultAzureCredential } = require("@azure/identity");
const { Client } = require("pg");

(async () => {
    try {
        // Отримання ідентифікатора User-Assigned Managed Identity з змінної середовища
        const clientId = process.env.AZURE_CLIENT_ID;
        if (!clientId) {
            throw new Error("AZURE_CLIENT_ID is not set. Please set the environment variable with your Managed Identity Client ID.");
        }

        // Отримання токена доступу за допомогою User-Assigned Managed Identity
        const credential = new DefaultAzureCredential({
            managedIdentityClientId: clientId
        });

        const tokenResponse = await credential.getToken("https://ossrdbms-aad.database.windows.net/.default");
        if (!tokenResponse || !tokenResponse.token) {
            throw new Error("Failed to acquire access token.");
        }

        const accessToken = tokenResponse.token;

        // Побудова рядка підключення
        const host = process.env.PG_HOST || "your-server-name.postgres.database.azure.com";
        const database = process.env.PG_DATABASE || "your-database-name";
        const user = process.env.PG_USER || "<identity_name>";

        const connectionString = {
            host: host,
            database: database,
            user: user,
            password: accessToken,
            ssl: {
                rejectUnauthorized: false // Trust Server Certificate
            }
        };

        // Підключення до бази даних
        const client = new Client(connectionString);
        await client.connect();

        console.log("Connection successful!");

        // Простий SQL-запит
        const res = await client.query("SELECT version();");
        console.log(`PostgreSQL version: ${res.rows[0].version}`);

        await client.end();
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
})();
