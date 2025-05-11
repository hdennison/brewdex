export type FormOutput = {
  name: string;
  contributors: string[];
  attachments: string[];
};

// Store for tracking extra contributor and attachment counts
export type FormState = {
  extraContributors: number;
  extraAttachments: number;
};
