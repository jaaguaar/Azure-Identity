import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

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

    const accountName = 'stttchattest';
    const containerName = 'tt-chat-data-storage';

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
      await containerClient.getProperties();
      console.log(`Container ${containerName} exists, and GitHub Action works!`);
    } catch (error) {
      if (error.statusCode === 404) {
        console.log(`Container ${containerName} does not exist, and GitHub Action works!`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
