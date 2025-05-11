import { DocumentService } from "@/modules/document/document.service";
import { SortingSelect } from "./components/sort/select";
import { DocumentStore } from "@/modules/document/document.store";
import type { SortingCriteria } from "@/modules/document/types";
import { DocumentTable } from "./components/table/table";

export default async function HomePage() {
  const api = new DocumentService();
  const documentStore = new DocumentStore();

  try {
    const documents = await api.fetchAllDocuments();
    documentStore.set(documents);
  } catch {
    return <div>Couldn't connect to server!</div>;
  }

  function handleSort(event: Event) {
    const select = event.target as HTMLSelectElement;
    documentStore.sortBy(select.value as SortingCriteria);
  }

  return (
    <div>
      <h1 id="page-heading">Documents</h1>
      <SortingSelect onChange={handleSort} />
      <DocumentTable store={documentStore} />
    </div>
  );
}
