import React, { useCallback } from 'react'
import { Check } from 'lucide-react'

/**
 * CustomCheckboxProps defines properties for the custom checkbox control.
 */
export interface CustomCheckboxProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
}

/**
 * CustomCheckbox renders a styled accessible checkbox replacing browser default inputs.
 *
 * @param props - Component specification including checked state and callback.
 * @returns Rendered JSX element for custom checkbox.
 */
export function CustomCheckbox(props: CustomCheckboxProps): React.JSX.Element {
  const {
    id,
    checked,
    onChange,
    label,
    description,
    disabled = false,
    className = ''
  } = props

  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!checked)
    }
  }, [checked, disabled, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
        e.preventDefault()
        onChange(!checked)
      }
    },
    [checked, disabled, onChange]
  )

  return (
    <div className={`flex items-start gap-2.5 select-none ${className}`}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`mt-0.5 relative shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
          disabled
            ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-60'
            : checked
            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
            : 'bg-white border-slate-300 hover:border-emerald-400'
        }`}
      >
        <Check
          size={12}
          strokeWidth={3}
          className={`transition-transform duration-150 ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </button>

      {label && (
        <div
          onClick={handleToggle}
          className={`cursor-pointer ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <span className="text-xs font-semibold text-slate-700 block leading-tight">
            {label}
          </span>
          {description && (
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
