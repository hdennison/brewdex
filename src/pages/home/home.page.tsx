import { DocumentService } from "@/modules/document/document.service";
import { SortingSelect } from "./components/sort/select";
import { DocumentStore } from "@/modules/document/document.store";
import { DocumentTable } from "./components/table/table";
import type { SortingCriteria } from "@/modules/document/types";

import styles from './home.module.css';

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
    <main className={styles.main}>
      <h1 id="page-heading">Documents</h1>
      <div className={styles.toolbar} role="toolbar" aria-label="View controls">
        <SortingSelect aria-controls="docs-list" onChange={handleSort} />
      </div>
      <DocumentTable store={documentStore} />
    </main>
  );
}
