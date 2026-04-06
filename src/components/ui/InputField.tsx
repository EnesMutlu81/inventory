import { InputHTMLAttributes, forwardRef } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helpText, className = "", id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-label font-medium uppercase tracking-[0.05em] text-on-surface-variant"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-11 px-3 rounded-md font-body text-sm text-on-surface
            bg-surface-container-highest border-0 border-b-2
            transition-all duration-150 outline-none
            placeholder:text-outline
            ${
              error
                ? "border-error bg-red-50 focus:border-error"
                : "border-transparent focus:border-primary"
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-error font-label">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-xs text-on-surface-variant font-label">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
