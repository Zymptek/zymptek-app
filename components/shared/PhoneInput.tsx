import { cn } from "@/lib/utils";
import PhoneInputBase from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function PhoneInput({ value, onChange, placeholder, error, onValidationChange }: PhoneInputProps) {
  return (
    <div className="space-y-1.5 w-full">
      <div className={cn(
        "phone-input-container",
        error && "phone-input-error"
      )}>
        <PhoneInputBase
          international
          defaultCountry="US"
          value={value}
          onChange={(value) => {
            onChange(value || "");
            onValidationChange?.(!!value);
          }}
          placeholder={placeholder || "Enter phone number"}
          className={cn(
            "h-10 bg-white/50 border border-brand-100/20 rounded-md",
            "focus:border-brand-200 focus:ring-1 focus:ring-brand-200/30",
            "placeholder:text-gray-400 text-[13px] font-medium",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
          )}
        />
      </div>
      {error && (
        <p className="text-[11px] text-red-400 font-medium mt-1">
          Please enter a valid phone number
        </p>
      )}

      <style jsx global>{`
        .phone-input-container .PhoneInput {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .phone-input-container .PhoneInputCountry {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.5rem;
          min-width: 80px;
          border: 1px solid rgba(var(--brand-100), 0.2);
          border-right: 0;
          border-radius: 0.375rem 0 0 0.375rem;
          background: rgba(255, 255, 255, 0.5);
        }

        .phone-input-container .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
          font-size: 13px;
        }

        .phone-input-container .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phone-input-container .PhoneInputCountryIcon--border {
          box-shadow: none;
          border: none;
        }

        .phone-input-container .PhoneInputCountrySelectArrow {
          margin-left: auto;
          border: solid #666;
          border-width: 0 1.5px 1.5px 0;
          display: inline-block;
          padding: 2.5px;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
          opacity: 0.5;
          margin-top: -2px;
        }

        .phone-input-container .PhoneInputInput {
          flex: 1;
          min-width: 0;
          height: 40px;
          border-radius: 0 0.375rem 0.375rem 0;
          border: 1px solid rgba(var(--brand-100), 0.2);
          border-left: 0;
          padding: 0 0.75rem;
          font-size: 13px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.5);
          color: var(--brand-950);
        }

        .phone-input-container .PhoneInputInput:focus {
          outline: none;
          border-color: var(--brand-200);
          box-shadow: 0 0 0 1px rgba(var(--brand-200), 0.3);
        }

        .phone-input-error .PhoneInputCountry {
          border-color: rgb(248 113 113);
        }

        .phone-input-error .PhoneInputInput {
          border-color: rgb(248 113 113);
        }

        .phone-input-error .PhoneInputInput:focus {
          border-color: rgb(248 113 113);
          box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.2);
        }
      `}</style>
    </div>
  );
} 