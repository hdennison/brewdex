import type { AppNotification } from "./types";

interface NotificationSubscriptionOptions {
  onMessage: (notification: AppNotification) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event | Error) => void;
  maxReconnectAttempts?: number;
  initialReconnectDelayMs?: number;
}

export class NotificationSubscription {
  private wsUrl = "ws://localhost:8080/notifications";
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectDelay: number;
  private manuallyClosed = false;
  private readonly opts: Required<NotificationSubscriptionOptions>;

  constructor(opts: NotificationSubscriptionOptions) {
    // fill in defaults
    this.opts = {
      onMessage: opts.onMessage,
      onClose: opts.onClose ?? (() => {}),
      onError: opts.onError ?? (() => {}),
      maxReconnectAttempts: opts.maxReconnectAttempts ?? 3,
      initialReconnectDelayMs: opts.initialReconnectDelayMs ?? 1000,
    };
    this.reconnectDelay = this.opts.initialReconnectDelayMs;

    this.connect();
  }

  private connect() {
    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.addEventListener("open", () => {
        this.reconnectAttempts = 0;
        this.reconnectDelay = this.opts.initialReconnectDelayMs;
      });

      this.socket.addEventListener("message", async (event) => {
        try {
          let raw: string;

          if (typeof event.data === "string") {
            raw = event.data;
          } else {
            raw = await (event.data as Blob).text();
          }

          const notification = JSON.parse(raw) as AppNotification;
          this.opts.onMessage(notification);
        } catch (err) {
          console.error("Failed to parse notification:", err);
        }
      });

      this.socket.addEventListener("close", (event) => {
        this.socket = null;
        this.opts.onClose(event);

        if (this.manuallyClosed) {
          return; // caller asked to stop
        }

        if (this.reconnectAttempts < this.opts.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.warn(
            `WebSocket closed (code=${event.code}), reconnect #${this.reconnectAttempts} in ${this.reconnectDelay}ms…`
          );
          setTimeout(() => this.connect(), this.reconnectDelay);
          this.reconnectDelay *= 2; // exponential reconnectDelay
        } else {
          console.error("Max reconnect attempts reached; giving up.");
        }
      });

      this.socket.addEventListener("error", (err) => {
        this.opts.onError(err);
        console.error("WebSocket error:", err);
        this.socket?.close();
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("WebSocket setup failure:", msg);
    }
  }

  close() {
    this.manuallyClosed = true;
    this.socket?.close();
  }
}
