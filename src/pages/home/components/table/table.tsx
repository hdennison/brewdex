
import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";
import { DocumentStore } from "@/modules/document/document.store";

export class DocumentTable extends ReactiveComponent<DocumentStore> {
  constructor(props: { store: DocumentStore }) {
    super(props)

    this.root = (
      <table
        aria-live="polite"
        className="table"
        aria-labelledby="page-heading"
      />
    );
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
            <tr className="row">
              <td className="cell">
                <strong>{item.Title}</strong>
                <div>Created: {item.CreatedAt}</div>
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
        </tbody>
      </>
    )
  }
}