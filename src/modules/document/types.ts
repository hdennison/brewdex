type Contributor = {
  ID: string;
  Name: string;
};

/*
  Using Doc instead of Document in order to avoid confusion with the built-in DOM interface
*/

export type Doc = {
  ID: string;
  Title: string;
  Version: string;
  CreatedAt: string;
  Contributors: Contributor[];
  Attachments: string[];
};
