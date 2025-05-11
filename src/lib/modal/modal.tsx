import { ReactiveComponent } from "../reactive-component/reactive-component";
import type { ModalStore } from "./modal.store";

export class Modal extends ReactiveComponent<ModalStore> {
  private content: Node;
  private title: string;

  constructor(props: { content: Node; store: ModalStore; title: string }) {
    super(props);

    this.content = props.content;
    this.title = props.title;

    this.root = (<dialog id="modal" aria-labelledby="modal-heading" />)

    this.store.subscribe(() => {
      const dialog = this.root as HTMLDialogElement;

      this.store.isOpen() ? dialog.showModal() : dialog.close()

      this.update();
    });
  }


  render(): Node {
    return (
      // @ts-expect-error
      <>
        <header>
          <h2 id="modal-heading">{this.title}</h2>
          <button
            type="button"
            onClick={() => this.store.close()}
            title="Close dialog"
          >
            ✕
          </button>
        </header>
        <div id="modal-content">
          {this.content}
        </div>
      </>
    );
  }
}
