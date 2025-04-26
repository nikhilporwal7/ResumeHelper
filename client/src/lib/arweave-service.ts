import Arweave from 'arweave';
import { ResumeData } from '@shared/schema';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

// The process ID you provided
const PROCESS_ID = 'FpZIj5iTHxKybufO6nc3Ab_DKPMgfJbVVs_oiazD4Fc';

export interface ArweaveStorageResult {
  id: string;
  url: string;
}

/**
 * Stores resume data on Arweave
 * @param resumeData The resume data to store
 * @param wallet The Arweave wallet to use for the transaction (if provided)
 * @returns A Promise resolving to the transaction ID and URL
 */
export async function storeResumeOnArweave(
  resumeData: ResumeData,
  wallet?: any
): Promise<ArweaveStorageResult> {
  try {
    // Prepare the data for storage
    const data = JSON.stringify(resumeData);
    
    // Create a transaction
    const transaction = await arweave.createTransaction({
      data,
    }, wallet);
    
    // Add tags to make the data identifiable and queryable
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'Resume-Builder');
    transaction.addTag('Resume-ID', resumeData.id?.toString() || '0');
    transaction.addTag('Resume-Title', resumeData.title);
    transaction.addTag('Process-ID', PROCESS_ID);
    
    // If a wallet was provided, sign the transaction
    if (wallet) {
      await arweave.transactions.sign(transaction, wallet);
    }
    
    // Submit the transaction
    const response = await arweave.transactions.post(transaction);
    
    if (response.status === 200 || response.status === 202) {
      const txId = transaction.id;
      return {
        id: txId,
        url: `https://arweave.net/${txId}`
      };
    } else {
      throw new Error(`Failed to submit transaction: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error storing resume on Arweave:', error);
    throw error;
  }
}

/**
 * Retrieves resume data from Arweave by transaction ID
 * @param transactionId The transaction ID to retrieve
 * @returns A Promise resolving to the resume data
 */
export async function getResumeFromArweave(transactionId: string): Promise<ResumeData | null> {
  try {
    const response = await arweave.transactions.getData(transactionId, {
      decode: true,
      string: true
    });
    
    if (response) {
      return JSON.parse(response as string) as ResumeData;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving resume from Arweave:', error);
    throw error;
  }
}

/**
 * Retrieves all resumes stored with the provided process ID
 * @returns A Promise resolving to an array of transaction IDs and their data
 */
export async function getAllResumesFromArweave(): Promise<{id: string, data: ResumeData}[]> {
  try {
    // Query for transactions with the process ID
    const query = `{
      transactions(
        tags: [
          { name: "Process-ID", values: ["${PROCESS_ID}"] },
          { name: "App-Name", values: ["Resume-Builder"] }
        ]
      ) {
        edges {
          node {
            id
            tags {
              name
              value
            }
          }
        }
      }
    }`;
    
    const response = await arweave.api.post('/graphql', { query });
    
    if (response.data && response.data.data) {
      const transactions = response.data.data.transactions.edges;
      
      // Fetch data for each transaction
      const resumesPromises = transactions.map(async (edge: any) => {
        const txId = edge.node.id;
        const data = await getResumeFromArweave(txId);
        return { id: txId, data };
      });
      
      return await Promise.all(resumesPromises);
    }
    
    return [];
  } catch (error) {
    console.error('Error retrieving all resumes from Arweave:', error);
    throw error;
  }
}