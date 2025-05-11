import { Factory } from "fishery";
import type { Doc } from "../types";

export const documentFactory = Factory.define<Doc>(() => ({
  ID: "",
  Title: "Alpha",
  Version: "0.0.1",
  CreatedAt: "",
  Contributors: [{ ID: "", Name: "" }],
  Attachments: [""],
}));
