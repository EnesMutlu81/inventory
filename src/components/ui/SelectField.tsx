import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, error, helpText, options, placeholder, className = "", id, ...props },
    ref
  ) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-xs font-label font-medium uppercase tracking-[0.05em] text-on-surface-variant"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full h-11 pl-3 pr-10 rounded-md font-body text-sm text-on-surface
              bg-surface-container-highest border-0 border-b-2 appearance-none
              transition-all duration-150 outline-none cursor-pointer
              ${
                error
                  ? "border-error bg-red-50 focus:border-error"
                  : "border-transparent focus:border-primary"
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            expand_more
          </span>
        </div>
        {error && <p className="text-xs text-error font-label">{error}</p>}
        {helpText && !error && (
          <p className="text-xs text-on-surface-variant font-label">{helpText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
export default SelectField;
