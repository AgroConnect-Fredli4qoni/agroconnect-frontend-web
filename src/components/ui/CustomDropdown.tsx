import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * DropdownOption defines the contract for selectable option items.
 */
export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

/**
 * CustomDropdownProps specifies the configuration for the custom dropdown element.
 */
export interface CustomDropdownProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  leadingIcon?: React.ReactNode
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * CustomDropdown renders a bespoke, accessible dropdown menu replacing native select elements.
 *
 * @param props - Configuration properties including options, value, and change callback.
 * @returns Rendered JSX element for custom dropdown.
 */
export function CustomDropdown(props: CustomDropdownProps): React.JSX.Element {
  const {
    id,
    value,
    onChange,
    options,
    placeholder = 'Pilih opsi...',
    leadingIcon,
    disabled = false,
    className = '',
    ariaLabel
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }, [disabled])

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val)
      setIsOpen(false)
    },
    [onChange]
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-emerald-500 ring-2 ring-emerald-100 text-slate-900 shadow-xs'
            : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {leadingIcon && (
            <span className="shrink-0 text-slate-400">{leadingIcon}</span>
          )}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 text-center">
              Tidak ada opsi tersedia
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    {option.icon && (
                      <span className="shrink-0">{option.icon}</span>
                    )}
                    <div className="truncate">
                      <span>{option.label}</span>
                      {option.description && (
                        <p className="text-[10px] text-slate-400 font-normal truncate">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={14} className="shrink-0 text-emerald-600" />
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
