export const FormRoot = (props: {
  onSubmit: (e: SubmitEvent) => void,
  onAddContributor: () => void,
  onAddAttachment: () => void,
}) => (
  <form
    id="form"
    onSubmit={props.onSubmit}
    aria-labelledby="modal-heading"
  >
    <div className="form-item">
      <label htmlFor="name">Document Name</label>
      <input id="name" name="name" type="text" required />
    </div>

    <fieldset id="contributors-fieldset">
      <legend>Contributors</legend>
      <div id="contributors-container"></div>
      <button
        type="button"
        onClick={props.onAddContributor}
        aria-label="Add another contributor"
      >
        + Contributor
      </button>
    </fieldset>

    <fieldset id="attachments-fieldset">
      <legend>Attachments</legend>
      <div id="attachments-container"></div>
      <button
        type="button"
        onClick={props.onAddAttachment}
        aria-label="Add another attachment"
      >
        + Attachment
      </button>
    </fieldset>

    <button type="submit">Add Document</button>
  </form>
)