import { Store } from "@/lib/store/store";
import type { FormState } from "./types";

export class DocumentFormStore extends Store<FormState> {
  constructor() {
    super([{ extraContributors: 0, extraAttachments: 0 }]);
  }

  addContributor() {
    const state = this.get()[0];
    this.set([{ ...state, extraContributors: state.extraContributors + 1 }]);
  }

  removeContributor() {
    const state = this.get()[0];
    if (state.extraContributors > 0) {
      this.set([{ ...state, extraContributors: state.extraContributors - 1 }]);
    }
  }

  addAttachment() {
    const state = this.get()[0];
    this.set([{ ...state, extraAttachments: state.extraAttachments + 1 }]);
  }

  removeAttachment() {
    const state = this.get()[0];
    if (state.extraAttachments > 0) {
      this.set([{ ...state, extraAttachments: state.extraAttachments - 1 }]);
    }
  }

  reset() {
    this.set([{ extraContributors: 0, extraAttachments: 0 }]);
  }
}
