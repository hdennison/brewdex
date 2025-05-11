
import { DocumentService } from "@/modules/document/document.service";
import { SortingSelect } from "./components/sort/select";
import { DocumentStore } from "@/modules/document/document.store";
import { DocumentTable } from "./components/table/table";
import { LayoutControls } from "./components/layout-controls/layout-controls";
import { LayoutStore } from "./home.store";
import type { SortingCriteria } from "@/modules/document/types";
import styles from './home.module.css';
import { ModalStore } from "@/lib/modal/modal.store";



export default async function HomePage() {
  const api = new DocumentService();
  const documentStore = new DocumentStore();
  const layoutStore = new LayoutStore(["list"]);
  const modalStore = new ModalStore({ open: false })

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

  function openModal() {
    modalStore.open();
  }

  return (
    // @ts-expect-error
    <>
      <main className={styles.main}>
        <h1 className={styles.title} id="page-heading">Documents</h1>
        <div className={styles.toolbar} role="toolbar" aria-label="View controls">
          <SortingSelect aria-controls="docs-list" onChange={handleSort} />
          <LayoutControls store={layoutStore} />
        </div>
        <DocumentTable documentStore={documentStore} layoutStore={layoutStore} openModalFn={openModal} />
      </main>
      {/* <Modal title="Add Document" content={<div>Content</div>} store={modalStore} /> */}
    </>
  );
}
