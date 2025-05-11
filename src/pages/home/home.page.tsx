
import { Modal } from "@/lib/modal/modal";
import { ModalStore } from "@/lib/modal/modal.store";
import { DocumentService } from "@/modules/document/document.service";
import { DocumentStore } from "@/modules/document/document.store";
import { DocumentForm } from "./components/form/form";
import { DocumentTable } from "./components/table/table";
import { formToDocument } from "./components/form/formatter";
import { LayoutControls } from "./components/layout-controls/layout-controls";
import { SortingSelect } from "./components/sort/select";
import { LayoutStore } from "./home.store";
import type { SortingCriteria } from "@/modules/document/types";

import styles from './home.module.css';
import { DocumentFormStore } from "./components/form/form.store";
import type { FormOutput } from "./components/form/types";

export default async function HomePage() {
  const api = new DocumentService();
  const documentStore = new DocumentStore();
  const layoutStore = new LayoutStore(["list"]);
  const modalStore = new ModalStore({ open: false })
  const formStore = new DocumentFormStore();
  const formComponent = new DocumentForm({
    submitFn: handleSubmit,
    store: formStore
  });

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

  function handleSubmit(output: FormOutput) {
    documentStore.add(formToDocument(output));
    modalStore.close();
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
      <Modal
        store={modalStore}
        title="Add Document"
        content={formComponent.getElement()}
      />
    </>
  );
}
