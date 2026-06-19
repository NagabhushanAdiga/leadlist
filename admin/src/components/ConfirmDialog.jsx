import './ConfirmDialog.css'

const VARIANT_META = {
  primary: {
    icon: '✓',
    iconClass: 'confirm-icon-primary',
    accentClass: 'confirm-dialog-primary',
  },
  success: {
    icon: '✓',
    iconClass: 'confirm-icon-success',
    accentClass: 'confirm-dialog-success',
  },
  warning: {
    icon: '!',
    iconClass: 'confirm-icon-warning',
    accentClass: 'confirm-dialog-warning',
  },
  danger: {
    icon: '×',
    iconClass: 'confirm-icon-danger',
    accentClass: 'confirm-dialog-danger',
  },
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  onConfirm,
  onCancel,
}) {
  const meta = VARIANT_META[variant] || VARIANT_META.primary

  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className={`confirm-dialog ${meta.accentClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`confirm-icon ${meta.iconClass}`}>{meta.icon}</div>
        <h3 id="confirm-title" className="confirm-title">
          {title}
        </h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${
              variant === 'danger'
                ? 'btn-danger-solid'
                : variant === 'warning'
                  ? 'btn-warning-solid'
                  : variant === 'success'
                    ? 'btn-success-solid'
                    : 'btn-primary'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
