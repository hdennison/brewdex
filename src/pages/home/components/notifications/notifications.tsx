import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";
import { NotificationStore } from "@/modules/notification/notification.store";
import { Counter } from "./counter";

import styles from '../../home.module.css';
import { Icon } from "@/lib/icon/icon";
import { NotificationSubscription } from "@/modules/notification/notification";
import type { AppNotification } from "@/modules/notification/types";

export class NotificationsClass extends ReactiveComponent<NotificationStore> {
  private counter: Counter;
  private contentEl: HTMLElement;

  constructor() {
    const store = new NotificationStore([]);
    super({ store });

    this.root = (
      <aside id="notifications-container" className={styles.notificationsContainer}>
        <div className={styles.notificationsContent}>
          <div className={styles.icoWrapper}>
            <Icon name="bell" size={20} />
            <span id="notifications-count" className={styles.badge}></span>
          </div>
          New document added
        </div>
      </aside>
    );

    const container = this.root as HTMLElement;
    this.contentEl = container.querySelector(`.${styles.notificationsContent}`)!;

    this.counter = new Counter(store);
    const placeholder = container.querySelector('#notifications-count')!;
    this.counter.mount(placeholder);

    new NotificationSubscription({
      onMessage: (msg: AppNotification) => store.push(msg),
      onClose: (e) => console.log('Notifications WS closed:', e.code),
      onError: (err) => console.error('Notifications WS error:', err),
    });

    // toggle scale from center, coercing getAmount() to number
    const updateVisibility = () => {
      const count = Number(store.getAmount());
      if (count > 0) {
        this.contentEl.classList.add(styles.notificationsContentVisible);
      } else {
        this.contentEl.classList.remove(styles.notificationsContentVisible);
      }
    };

    updateVisibility();
    store.subscribe(updateVisibility);
  }

  public override render(): Node {
    return this.root;
  }

  public override update(): void { }
}

export function Notifications() {
  const host = document.createDocumentFragment();
  new NotificationsClass().mount(host);
  return host;
}
