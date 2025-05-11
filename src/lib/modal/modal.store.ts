import { Store } from "@/lib/store/store";

type modalState = {
  open: boolean;
};
export class ModalStore extends Store<modalState> {
  constructor(initial: modalState) {
    super([initial]);
  }

  open() {
    this.set([{ open: true }]);
  }
  close() {
    this.set([{ open: false }]);
  }

  isOpen(): boolean {
    return this.get()[0].open;
  }
}
