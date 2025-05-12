import type { Doc } from "./types";

export class DocumentService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl;
  }

  async fetchAllDocuments(): Promise<Doc[]> {
    const url = `${this.baseUrl}/documents`;

    // Perform the request
    const response = await fetch(url);

    // Throw if the response is not OK, so errors bubble up
    if (!response.ok) {
      throw new Error(
        `Failed to fetch documents: ${response.status} ${response.statusText}`
      );
    }

    // Parse and return the list of documents
    return (await response.json()) as Doc[];
  }
}
