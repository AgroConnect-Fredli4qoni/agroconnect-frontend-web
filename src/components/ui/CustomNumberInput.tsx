import React, { useCallback } from 'react'

/**
 * CustomNumberInputProps defines configuration for the custom numeric input field.
 */
export interface CustomNumberInputProps {
  id?: string
  value: number | string
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  required?: boolean
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * CustomNumberInput provides a consistent numeric input control with custom prefix/suffix styling.
 *
 * @param props - Numeric input specifications.
 * @returns Rendered JSX element.
 */
export function CustomNumberInput(props: CustomNumberInputProps): React.JSX.Element {
  const {
    id,
    value,
    onChange,
    placeholder = '0',
    min,
    max,
    step = 1,
    prefix,
    suffix,
    required = false,
    disabled = false,
    className = '',
    ariaLabel
  } = props

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (val === '') {
        onChange('')
        return
      }
      const num = Number(val)
      if (!isNaN(num)) {
        if (min !== undefined && num < min) {
          onChange(String(min))
          return
        }
        if (max !== undefined && num > max) {
          onChange(String(max))
          return
        }
        onChange(val)
      }
    },
    [max, min, onChange]
  )

  return (
    <div
      className={`relative flex items-center bg-slate-50 border border-slate-200 rounded-lg transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 ${
        disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {prefix && (
        <span className="pl-3 text-xs font-semibold text-slate-400 select-none pointer-events-none">
          {prefix}
        </span>
      )}

      <input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        className="w-full px-3 py-2 text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {suffix && (
        <span className="pr-3 text-xs font-medium text-slate-400 select-none pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  )
}
