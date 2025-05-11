import { DocumentService } from "@/modules/document/document.service";
import type { Doc } from "@/modules/document/types";

export default async function HomePage() {
  const api = new DocumentService();
  let documents: Doc[] = []

  try {
    documents = await api.fetchAllDocuments();
  } catch {
    return <div>Couldn't connect to server!</div>;
  }

  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {documents.map(({ Title }) => <li>{Title}</li>)}
      </ul>
    </div>
  )
}
