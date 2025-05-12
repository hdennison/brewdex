/*
  Using AppNotification instead of Notification in order to avoid confusion with the built-in DOM interface
*/

export type AppNotification = {
  Timestamp: string;
  UserID: string;
  UserName: string;
  DocumentID: string;
  DocumentTitle: string;
};
