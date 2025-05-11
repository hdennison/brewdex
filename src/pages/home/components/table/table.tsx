import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";
import { DocumentStore } from "@/modules/document/document.store";
import type { LayoutStore } from "../../home.store";

import styles from '../../home.module.css'
import { getRelativeTimeFromNow } from "@/lib/date/date";

export class DocumentTable extends ReactiveComponent<DocumentStore> {
  private layoutStore: LayoutStore;
  private openModalFn: () => void;

  constructor(props: {
    documentStore: DocumentStore;
    layoutStore: LayoutStore,
    openModalFn: () => void
  }) {
    super({ store: props.documentStore });

    this.layoutStore = props.layoutStore;
    this.openModalFn = props.openModalFn;

    console.log(this.openModalFn)

    this.root = (
      <table
        aria-live="polite"
        className="table"
        aria-labelledby="page-heading"
        data-layout={this.layoutStore.get()}
        // this CSS var needs to match the amount of columns in the table
        style="--columns: 3"
      />
    );

    this.layoutStore.subscribe(() => {
      if (this.root instanceof HTMLElement) {
        this.root.setAttribute("data-layout", String(this.layoutStore.get()));
      }
    });
  }

  render(): Node {
    const docs = this.store.get();

    return (
      // @ts-expect-error @TODO: Tell TS about Fragments
      <>
        <thead>
          <tr className="row">
            <th className="cell">Name</th>
            <th className="cell">Contributors</th>
            <th className="cell">Attachments</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((item) => (
            <tr className={`row ${styles.document}`}>
              <td className="cell">
                <strong>{item.Title}</strong>
                <div>Created: {getRelativeTimeFromNow(item.CreatedAt)}</div>
                <div>Version: {item.Version}</div>
              </td>
              <td className="cell">
                <ul>
                  {item.Contributors.map((c) => <li>{c.Name}</li>)}
                </ul>
              </td>
              <td className="cell">
                <ul>
                  {item.Attachments.map((a) => <li>{a}</li>)}
                </ul>
              </td>
            </tr>
          ))}
          {/* <tr>
            <button type="button" aria-label="Add a new document" className={styles.addButton} onClick={this.openModalFn}>
              + Add document
            </button>
          </tr> */}
        </tbody>
      </>
    );
  }
}
