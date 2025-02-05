import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  showYearPicker?: boolean;
}

const CustomDatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder = "Select date", className, dateFormat, showYearPicker = false, minDate, maxDate, disabled }, ref) => {
    const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
      <Button
        variant="outline"
        role="combobox"
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full justify-start text-left font-normal h-11 bg-background hover:bg-accent hover:text-accent-foreground",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
        {value || placeholder}
      </Button>
    ));

    CustomInput.displayName = "CustomInput";

    return (
      <div className="relative">
        <style jsx global>{`
          .react-datepicker {
            @apply font-sans border border-brand-100/20 bg-white shadow-lg rounded-lg overflow-hidden;
            @apply backdrop-blur-sm;
          }
          .react-datepicker__header {
            @apply bg-gradient-to-br from-brand-100/5 to-brand-200/5 border-b border-brand-100/10 py-2;
          }
          .react-datepicker__current-month {
            @apply text-brand-200 font-medium mb-1;
          }
          .react-datepicker__day-names {
            @apply border-b border-brand-100/10 mx-0 pb-2;
          }
          .react-datepicker__day-name {
            @apply text-brand-200/60 font-medium text-xs w-8 mx-1;
          }
          .react-datepicker__month {
            @apply p-2;
          }
          .react-datepicker__day {
            @apply w-8 h-8 mx-1 my-0.5 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer transition-all duration-200;
            @apply text-brand-200/70 hover:text-brand-200 hover:bg-brand-100/10;
            @apply active:scale-95;
          }
          .react-datepicker__day--selected {
            @apply !bg-brand-200 !text-white shadow-md shadow-brand-200/20;
            @apply hover:!bg-brand-200/90 hover:!text-white;
            @apply !scale-105 hover:!scale-100;
          }
          .react-datepicker__day--keyboard-selected {
            @apply !bg-brand-100/10 !text-brand-200;
          }
          .react-datepicker__day--disabled {
            @apply text-brand-200/30 cursor-not-allowed;
            @apply hover:bg-transparent hover:text-brand-200/30;
            @apply active:scale-100;
          }
          .react-datepicker__day--outside-month {
            @apply text-brand-200/30;
          }
          .react-datepicker__day--today {
            @apply border-2 border-brand-200/20 font-semibold;
          }
          /* Year Picker Styles */
          .react-datepicker__year {
            @apply p-3;
          }
          .react-datepicker__year-wrapper {
            @apply !grid !grid-cols-4 gap-2 max-w-[320px];
          }
          .react-datepicker__year-text {
            @apply flex items-center justify-center w-[4rem] h-10 rounded-md text-sm font-medium cursor-pointer transition-all duration-200;
            @apply text-brand-200/70 hover:text-brand-200 hover:bg-brand-100/10;
            @apply active:scale-95;
          }
          .react-datepicker__year-text--selected {
            @apply !bg-brand-200 !text-white shadow-md shadow-brand-200/20;
            @apply hover:!bg-brand-200/90 hover:!text-white;
            @apply !scale-105 hover:!scale-100;
          }
          .react-datepicker__year-text--keyboard-selected:not(.react-datepicker__year-text--selected) {
            @apply !bg-brand-100/10 !text-brand-200;
          }
          .react-datepicker__year-text--disabled {
            @apply text-brand-200/30 cursor-not-allowed;
            @apply hover:bg-transparent hover:text-brand-200/30;
            @apply active:scale-100;
          }
          .react-datepicker__navigation {
            @apply top-3;
          }
          .react-datepicker__navigation--previous {
            @apply left-3;
          }
          .react-datepicker__navigation--next {
            @apply right-3;
          }
          .react-datepicker__navigation-icon::before {
            @apply border-brand-200/50 border-[2px] border-r-0 border-t-0 w-2 h-2;
            @apply transition-transform duration-200;
          }
          .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
            @apply border-brand-200;
          }
          .react-datepicker-popper {
            @apply z-50;
          }
          .react-datepicker__triangle {
            @apply hidden;
          }
          .react-datepicker__aria-live {
            @apply sr-only;
          }
          .react-datepicker__month-container {
            @apply p-2;
          }
          .react-datepicker__week {
            @apply flex justify-center;
          }
        `}</style>
        <DatePicker
          selected={value}
          onChange={onChange}
          customInput={<CustomInput />}
          dateFormat={dateFormat || (showYearPicker ? "yyyy" : "MMMM d, yyyy")}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          showPopperArrow={false}
          popperClassName="react-datepicker-right"
          popperPlacement="bottom-start"
          calendarClassName="!font-sans"
          className="w-full"
          showMonthDropdown={!showYearPicker}
          showYearDropdown={!showYearPicker}
          dropdownMode="select"
          showYearPicker={showYearPicker}
          yearItemNumber={12}
          fixedHeight
        />
      </div>
    );
  }
);

CustomDatePicker.displayName = "CustomDatePicker";

export { CustomDatePicker }; 