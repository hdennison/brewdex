import { ReactiveComponent } from '@/lib/reactive-component/reactive-component'
import { Store } from '@/lib/store/store'

export const counterStore = new Store<number>([0])

export class CounterDisplay extends ReactiveComponent<Store<number>> {
  constructor({ store }: { store: Store<number> }) {
    super(store);
  }

  public render(): Node {
    const [count] = this.store.get()

    return (
      <div>
        Count: {count}
      </div>
    )
  }
}
