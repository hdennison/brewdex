import { Store } from "@/lib/store/store";
import type { AppNotification } from "./types";

const MAX_DISPLAY = 9;

export class NotificationStore extends Store<AppNotification> {
  hasMany = false;

  constructor(initial: AppNotification[]) {
    super(initial);
    this.push = this.push.bind(this);
    this.getAmount = this.getAmount.bind(this);
  }

  push(notification: AppNotification) {
    this.add(notification);

    if (this.get().length > MAX_DISPLAY) {
      this.hasMany = true;
    }
  }

  getAmount(): number | string {
    const count = this.get().length;

    return count > MAX_DISPLAY ? `${MAX_DISPLAY}+` : count;
  }
}
