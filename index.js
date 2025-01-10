import { DefaultAzureCredential } from '@azure/identity';
import { DataSource } from 'typeorm';
const pg = require('pg'); // Import pg using require

(async () => {
  try {
    // Отримання ідентифікатора User-Assigned Managed Identity з змінної середовища
    const clientId = process.env.AZURE_CLIENT_ID;
    if (!clientId) {
      throw new Error(
        'AZURE_CLIENT_ID is not set. Please set the environment variable with your Managed Identity Client ID.'
      );
    }

    // Отримання токена доступу за допомогою User-Assigned Managed Identity
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: clientId,
    });

    const tokenResponse = await credential.getToken(
      'https://ossrdbms-aad.database.windows.net/'
    );
    if (!tokenResponse || !tokenResponse.token) {
      throw new Error('Failed to acquire access token.');
    }

    const accessToken = tokenResponse.token;

    // Побудова рядка підключення
    const host =
      process.env.PG_HOST || 'your-server-name.postgres.database.azure.com';
    const database = process.env.PG_DATABASE || 'your-database-name';
    const username = process.env.PG_USER || '<identity_name>';

    // Initialize TypeORM DataSource
    const dataSource = new DataSource({
      type: 'postgres',
      host: host,
      database: database,
      username: username,
      //   password: accessToken,
      //   extra: {
      //     type: 'azure-active-directory-msi-vm',
      //     options: {
      //       clientId: process.env.AZURE_CLIENT_ID,
      //     },
      //   },
      extra: {
        options: {
          connectionFactory: async () => {
            const client = new pg.Client({
              host,
              database,
              user: username,
              password: accessToken,
              ssl: true,
            });
            await client.connect();
            return client;
          },
        },
      },
      //   ssl: { rejectUnauthorized: false }, // Enable SSL for Azure
      ssl: true,
      //   synchronize: true, // For development only, not recommended in production
      entities: [
        /* Add your entities here */
      ],
    });

    // Establish the connection and perform a query
    try {
      await dataSource.initialize();
      console.log('Database connected successfully!');

      // Perform a simple query
      const result = await dataSource.query('SELECT version();');
      console.log(`PostgreSQL version: ${result[0].version}`);

      // Close the connection
      await dataSource.destroy();
      console.log('Connection closed.');
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
