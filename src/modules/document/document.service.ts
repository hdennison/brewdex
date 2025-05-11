import type { Doc } from "./types";

export class DocumentService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl;
  }

  async fetchAllDocuments(): Promise<Doc[]> {
    const url = `${this.baseUrl}/documents`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = (await response.json()) as Doc[];
      return data;
    } catch (error: unknown) {
      // console.error(error instanceof Error ? error.message : String(error));

      return [];
    }
  }
}
