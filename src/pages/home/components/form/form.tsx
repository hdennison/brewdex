import { ReactiveComponent } from "@/lib/reactive-component/reactive-component";

import { FormRoot } from "./components/root";
import { ExtraField } from "./components/extra-field";
import type { DocumentFormStore } from "./form.store";
import type { FormOutput } from "./types";

interface DocumentFormProps {
  submitFn: (output: FormOutput) => void;
  store: DocumentFormStore;
}

export class DocumentForm extends ReactiveComponent<DocumentFormStore> {
  private submitFn: (output: FormOutput) => void;

  constructor(props: DocumentFormProps) {
    super(props);
    this.submitFn = props.submitFn;

    this.root = (
      <FormRoot
        onSubmit={(e) => this.handleSubmit(e)}
        onAddContributor={() => this.store.addContributor()}
        onAddAttachment={() => this.store.addAttachment()}
      />
    );

    // Subscribe to store changes
    this.store.subscribe(() => this.update());
  }

  /**
   * Public getter to access the rendered root node
   */
  public getElement(): Node {
    return this.root;
  }

  override render(): Node {
    return this.root;
  }

  override update(): void {
    const form = this.root as HTMLFormElement;
    const state = this.store.get()[0];

    // Update contributor fields incrementally to preserve values
    const contribContainer = form.querySelector<HTMLElement>("#contributors-container");
    if (contribContainer) {
      const inputs = Array.from(
        contribContainer.querySelectorAll<HTMLInputElement>(
          'input[name="contributor"]'
        )
      );
      const desiredCount = 1 + state.extraContributors;
      const existingCount = inputs.length;

      // Append new contributor fields
      for (let idx = existingCount; idx < desiredCount; idx++) {
        const field = (
          <ExtraField
            type="contributor"
            idx={idx}
            onRemove={() => this.store.removeContributor()}
          />
        );
        contribContainer.appendChild(field);
      }
      // Remove excess contributor fields
      for (let idx = existingCount - 1; idx >= desiredCount; idx--) {
        const fieldEl = inputs[idx].closest(".form-item");
        fieldEl?.remove();
      }
    }

    // Update attachment fields incrementally to preserve values
    const attachContainer = form.querySelector<HTMLElement>("#attachments-container");
    if (attachContainer) {
      const inputs = Array.from(
        attachContainer.querySelectorAll<HTMLInputElement>(
          'input[name="attachment"]'
        )
      );
      const desiredCount = 1 + state.extraAttachments;
      const existingCount = inputs.length;

      // Append new attachment fields
      for (let idx = existingCount; idx < desiredCount; idx++) {
        const field = (
          <ExtraField
            type="attachment"
            idx={idx}
            onRemove={() => this.store.removeAttachment()}
          />
        );
        attachContainer.appendChild(field);
      }
      // Remove excess attachment fields
      for (let idx = existingCount - 1; idx >= desiredCount; idx--) {
        const fieldEl = inputs[idx].closest(".form-item");
        fieldEl?.remove();
      }
    }
  }

  private handleSubmit(e: SubmitEvent): void {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name")!.toString();
    const contributors = (formData.getAll("contributor") as string[]).map(String);
    const attachments = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[name=\"attachment\"")
    ).map((input) => input.files![0].name);

    this.submitFn({ name, contributors, attachments });
    form.reset();
    this.store.reset();
  }

  override mount(container: Node): void {
    container.appendChild(this.root);
    this.update();
  }
}
