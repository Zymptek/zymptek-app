import { Database } from '@/lib/database.types'
import { FormField } from '@/components/shared/DynamicForm'
import { addDays, startOfDay } from 'date-fns'

type IncotermType = Database['public']['Enums']['incoterm_type']
type PaymentMethodType = Database['public']['Enums']['payment_method_type']

export type OrderFormField = Omit<FormField, 'name'> & {
  id: string
  defaultValue?: any
}

type OrderFormConfig = {
  fields: OrderFormField[]
}

export const orderFormConfig: OrderFormConfig = {
  fields: [
    {
      id: 'quantity',
      label: 'Quantity',
      type: 'number' as const,
      required: true,
      min: 1,
      defaultValue: 1,
      placeholder: 'Enter quantity'
    },
    {
      id: 'unit',
      label: 'Unit',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'kg', label: 'Kilogram (kg)' },
        { value: 'box', label: 'Box' },
        { value: 'piece', label: 'Piece' },
        { value: 'litre', label: 'Litre (L)' }
      ]
    },
    {
      id: 'agreed_price',
      label: 'Agreed Price (USD)',
      type: 'number' as const,
      required: true,
      min: 0,
      placeholder: 'Enter the agreed price'
    },
    {
      id: 'incoterm',
      label: 'Incoterm',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'FOB', label: 'FOB (Free On Board)' },
        { value: 'CIF', label: 'CIF (Cost, Insurance, and Freight)' },
        { value: 'EXW', label: 'EXW (Ex Works)' },
        { value: 'DDP', label: 'DDP (Delivered Duty Paid)' }
      ]
    },
    {
      id: 'delivery_date',
      label: 'Expected Delivery Date',
      type: 'date' as const,
      required: true,
      min: addDays(new Date(), 1).toISOString().split('T')[0], // Tomorrow
      defaultValue: addDays(new Date(), 1).toISOString().split('T')[0], // Tomorrow
      calendarProps: {
        mode: 'single',
        defaultMonth: addDays(new Date(), 1),
        fromYear: new Date().getFullYear(),
        toYear: new Date().getFullYear() + 5,
        showOutsideDays: false,
        fixedWeeks: true,
        classNames: {
          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-brand-100/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          day_range_end: 'day-range-end',
          day_selected: 'bg-brand-200 text-white hover:bg-brand-300 hover:text-white focus:bg-brand-200 focus:text-white',
          day_today: 'bg-brand-100/50 text-brand-200',
          day_outside: 'day-outside text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle: 'aria-selected:bg-brand-100/50 aria-selected:text-brand-200',
          day_hidden: 'invisible',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          head_row: 'flex',
          head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          table: 'w-full border-collapse space-y-1',
          button: 'text-left p-0 m-0 border-0 bg-transparent',
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0'
        }
      }
    },
    {
      id: 'payment_method',
      label: 'Payment Method',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'letter_of_credit', label: 'Letter of Credit' }
      ]
    },
    {
      id: 'special_instructions',
      label: 'Special Instructions',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Enter any special instructions or notes (optional)',
      rows: 3
    }
  ] as const
} as const 

