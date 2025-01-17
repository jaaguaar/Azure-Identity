import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

(async () => {
  try {
    // Отримання ідентифікатора User-Assigned Managed Identity з змінної середовища
    // const clientId = process.env.AZURE_CLIENT_ID;
    // if (!clientId) {
    //   throw new Error(
    //     "AZURE_CLIENT_ID is not set. Please set the environment variable with your Managed Identity Client ID."
    //   );
    // }

    // Отримання токена доступу за допомогою User-Assigned Managed Identity
    const credential = new DefaultAzureCredential();

    const accountName = "stttchattest";
    const containerName = "tt-chat-data-storage";

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = "quickstart" + Math.random().toString() + ".txt";

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Display blob name and url
    console.log(
      `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    );

    // Upload data to the blob
    const data = "Hello, World!";
    const uploadBlobResponse = await blockBlobClient
      .upload(data, data.length)
      .catch((error) => {
        console.error(error);
        throw error;
      });
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
