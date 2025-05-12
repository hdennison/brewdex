import { ReactiveComponent } from '@/lib/reactive-component/reactive-component';
import type { NotificationStore } from '@/modules/notification/notification.store';

export class Counter extends ReactiveComponent<NotificationStore> {
  constructor(store: NotificationStore) {
    super({ store });
    this.root = document.createElement('span');

    this.store.subscribe(() => this.update());
    this.update();
  }

  public override render(): Node {
    return document.createTextNode(this.store.getAmount().toString());
  }
}