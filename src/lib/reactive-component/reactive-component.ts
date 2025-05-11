export abstract class ReactiveComponent<
  S extends { subscribe(cb: () => void): void }
> {
  protected store: S;
  protected root: Node;

  constructor(props: { store: S; root?: Node }) {
    this.store = props.store;
    this.root = props.root ?? document.createElement("div");
    this.store.subscribe(() => this.update());
  }

  private update() {
    if (
      this.root instanceof HTMLElement ||
      this.root instanceof DocumentFragment
    ) {
      this.root.replaceChildren(this.render());
    }
  }

  public abstract render(): Node;

  public mount(container: Node) {
    this.update();
    container.appendChild(this.root);
  }
}
