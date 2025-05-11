import { v4 as uuidv4 } from "uuid";

import type { Doc } from "@/modules/document/types";
import type { FormOutput } from "./types";

export const formToDocument = (output: FormOutput): Doc => {
  return {
    ID: uuidv4(),
    Title: output.name.trim(),
    Version: "0.0.1",
    CreatedAt: new Date().toISOString(),
    Contributors: output.contributors.map((contributor) => {
      /* 
        @TODO: just for demo purposes,
        doing it this way we can create many contributors with the same different ID but same name.
      */
      return {
        ID: uuidv4(),
        Name: contributor.trim(),
      };
    }),
    Attachments: output.attachments,
  };
};
