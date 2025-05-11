// src/pages/home/components/form/form.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import { DocumentForm } from './form';
import { DocumentFormStore } from './form.store';

describe('DocumentFormStore', () => {
  let store: DocumentFormStore;

  beforeEach(() => {
    store = new DocumentFormStore();
  });

  it('initializes with zero extras', () => {
    const [{ extraContributors, extraAttachments }] = store.get();
    expect(extraContributors).toBe(0);
    expect(extraAttachments).toBe(0);
  });

  it('addContributor increments extraContributors', () => {
    store.addContributor();
    expect(store.get()[0].extraContributors).toBe(1);
  });

  it('removeContributor decrements when > 0, no-op when = 0', () => {
    store.addContributor();
    store.addContributor();
    expect(store.get()[0].extraContributors).toBe(2);

    store.removeContributor();
    expect(store.get()[0].extraContributors).toBe(1);

    store.removeContributor();
    store.removeContributor(); // still zero
    expect(store.get()[0].extraContributors).toBe(0);
  });

  it('addAttachment and removeAttachment work correctly', () => {
    store.addAttachment();
    expect(store.get()[0].extraAttachments).toBe(1);

    store.removeAttachment();
    expect(store.get()[0].extraAttachments).toBe(0);

    store.removeAttachment();
    expect(store.get()[0].extraAttachments).toBe(0);
  });

  it('reset brings both counts back to zero', () => {
    store.addContributor();
    store.addAttachment();
    expect(store.get()[0]).toEqual({ extraContributors: 1, extraAttachments: 1 });

    store.reset();
    expect(store.get()[0]).toEqual({ extraContributors: 0, extraAttachments: 0 });
  });

  it('notifies subscribers on every state change', () => {
    const spy = vi.fn();
    store.subscribe(spy);
    spy.mockClear(); // clear initial notification

    store.addContributor();
    store.addAttachment();
    store.removeContributor();
    store.removeAttachment();
    store.reset();

    expect(spy).toHaveBeenCalledTimes(5);
  });
});

describe('DocumentForm', () => {
  let container: HTMLElement;
  let store: DocumentFormStore;
  let submitFn: ReturnType<typeof vi.fn>;
  let formComp: DocumentForm;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    store = new DocumentFormStore();
    submitFn = vi.fn();

    formComp = new DocumentForm({ submitFn, store });
    formComp.mount(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('getElement returns the node appended to the container', () => {
    expect(formComp.getElement()).toBe(container.firstChild);
  });

  it('render() returns the same node as getElement()', () => {
    expect(formComp.render()).toBe(formComp.getElement());
  });

  it('renders one contributor and one attachment input by default', () => {
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(1);
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(1);
  });

  it('adds and removes contributor fields when store updates', () => {
    store.addContributor();
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(2);

    store.removeContributor();
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(1);
  });

  it('adds and removes attachment fields when store updates', () => {
    store.addAttachment();
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(2);

    store.removeAttachment();
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(1);
  });

  it('preserves existing contributor values when adding a field', () => {
    const first = container.querySelector<HTMLInputElement>('input[name="contributor"]')!;
    first.value = 'pepe';

    store.addContributor();
    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[name="contributor"]'));
    expect(inputs[0].value).toBe('pepe');
    expect(inputs.length).toBe(2);
  });

  it('calls submitFn with correct FormOutput and clears form & store', () => {
    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!;
    nameInput.value = ' My Doc ';

    const contInput = container.querySelector<HTMLInputElement>('input[name="contributor"]')!;
    contInput.value = 'Alice';

    const fileInput = container.querySelector<HTMLInputElement>('input[name="attachment"]')!;
    const fakeFile = new File([''], 'myfile.txt', { type: 'text/plain' });
    Object.defineProperty(fileInput, 'files', { value: [fakeFile] });

    // capture before-submit values
    const expectedName = nameInput.value;
    const expectedContributors = [contInput.value];

    fireEvent.submit(container.querySelector('form')!);

    expect(submitFn).toHaveBeenCalledWith({
      name: expectedName,
      contributors: expectedContributors,
      attachments: ['myfile.txt'],
    });

    // after reset, inputs and store are back to initial
    expect(nameInput.value).toBe('');
    expect(store.get()[0]).toEqual({ extraContributors: 0, extraAttachments: 0 });
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(1);
    expect(container.querySelector<HTMLInputElement>('input[name="contributor"]')!.value).toBe('');
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(1);
  });
});

describe('DocumentForm user interactions (callbacks)', () => {
  let container: HTMLElement;
  let store: DocumentFormStore;
  let submitFn: ReturnType<typeof vi.fn>;
  let formComp: DocumentForm;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    store = new DocumentFormStore();
    submitFn = vi.fn();

    formComp = new DocumentForm({ submitFn, store });
    formComp.mount(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('clicking "+ Contributor" button invokes onAddContributor', () => {
    const btn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Add another contributor"]'
    )!;
    fireEvent.click(btn);
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(2);
  });

  it('clicking "Remove contributor 2" invokes onRemove', () => {
    store.addContributor();
    const removeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove contributor 2"]'
    )!;
    fireEvent.click(removeBtn);
    expect(container.querySelectorAll('input[name="contributor"]').length).toBe(1);
  });

  it('clicking "+ Attachment" button invokes onAddAttachment', () => {
    const btn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Add another attachment"]'
    )!;
    fireEvent.click(btn);
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(2);
  });

  it('clicking "Remove attachment 2" invokes onRemoveAttachment', () => {
    store.addAttachment();
    const removeBtn = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove attachment 2"]'
    )!;
    fireEvent.click(removeBtn);
    expect(container.querySelectorAll('input[name="attachment"]').length).toBe(1);
  });
});
