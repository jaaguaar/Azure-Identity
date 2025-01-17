import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

(async () => {
  try {
    // Отримання ідентифікатора User-Assigned Managed Identity з змінної середовища
    const clientId = "22f117cd-5e58-441a-8e01-be477784089f";
    if (!clientId) {
      throw new Error(
        "AZURE_CLIENT_ID is not set. Please set the environment variable with your Managed Identity Client ID."
      );
    }

    // Отримання токена доступу за допомогою User-Assigned Managed Identity
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: clientId,
    });

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
