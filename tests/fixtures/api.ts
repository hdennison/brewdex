import { documentFactory } from "../../src/modules/document/__test__/document.factory";

export const alpha = documentFactory.build({
  ID: "5136a4a1-4b68-481a-997a-0a35e36a4f8d",
  CreatedAt: "1950-09-21T00:25:22.63737438Z",
  Title: "Alpha",
  Attachments: ["First attachment", "Second attachment"],
  Version: "1.0.0",
  Contributors: [
    {
      ID: "911a929c-171a-45de-bc78-f5d3f64500c8",
      Name: "First contributor",
    },
    {
      ID: "911a929c-171a-45de-bc78-f5d3f64500c8",
      Name: "Second contributor",
    },
  ],
});

export const gamma = documentFactory.build({
  ID: "5136a4a1-4b68-481a-997a-0a35e36a4f8d",
  CreatedAt: "1950-09-21T00:25:22.63737438Z",
  Title: "Gamma",
  Attachments: ["1st attachment", "2nd attachment"],
  Version: "2.0.0",
  Contributors: [
    {
      ID: "911a929c-171a-45de-bc78-f5d3f64500c8",
      Name: "1st contributor",
    },
    {
      ID: "911a929c-171a-45de-bc78-f5d3f64500c8",
      Name: "2nd contributor",
    },
  ],
});

export const documents = [alpha, gamma];
