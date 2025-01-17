import { BlobServiceClient } from "@azure/storage-blob";

(async () => {
  try {
    // Отримання ідентифікатора User-Assigned Managed Identity з змінної середовища
    const clientId = process.env.AZURE_CLIENT_ID;
    if (!clientId) {
      throw new Error(
        "AZURE_CLIENT_ID is not set. Please set the environment variable with your Managed Identity Client ID."
      );
    }
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("Connection string not provided");
    }

    // Отримання токена доступу за допомогою User-Assigned Managed Identity
    // const credential = new DefaultAzureCredential({
    //   managedIdentityClientId: clientId,
    // });

    // const accountName = "stttchattest";
    const containerName = "tt-chat-data-storage";

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

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

    // try {
    // const containerClient = blobServiceClient.getContainerClient(containerName);
    //   await containerClient.getProperties();
    //   console.log(
    //     `Container ${containerName} exists, and GitHub Action works!`
    //   );
    // } catch (error) {
    //   if (error.statusCode === 404) {
    //     console.log(
    //       `Container ${containerName} does not exist, and GitHub Action works!`
    //     );
    //   } else {
    //     throw error;
    //   }
    // }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
})();
