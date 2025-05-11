export const ExtraField = (props: { idx: number, onRemove: () => void, type: 'contributor' | 'attachment' }) => {
  const { idx, type } = props;

  const label = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <div className="form-item">
      <label htmlFor={`${type}-${idx + 1}`}>
        {label} {idx + 1}
      </label>
      <div className="flex">
        <input
          id={`${type}-${idx + 1}`}
          name={type}
          type={type === 'attachment' ? 'file' : 'text'}
          required={idx === 0}
          className="flex-1"
        />
        {idx > 0 ? (
          <button
            type="button"
            onClick={props.onRemove}
            aria-label={`Remove ${type} ${idx + 1}`}
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  )
}