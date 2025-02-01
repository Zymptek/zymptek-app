import { z } from 'zod'
import { OrderFormField } from '@/lib/config/order-form'
import { addDays, startOfDay } from 'date-fns'

export const generateOrderSchema = (fields: OrderFormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case 'text':
        fieldSchema = z.string()
        break
      case 'number': {
        let schema = z.coerce.number({
          invalid_type_error: `${field.label} must be a valid number`,
          required_error: `${field.label} is required`
        })
        if ('min' in field && field.min !== undefined) {
          const minValue = typeof field.min === 'string' ? parseInt(field.min) : field.min
          if (!isNaN(minValue)) {
            schema = schema.min(minValue, `${field.label} must be at least ${minValue}`)
          }
        }
        fieldSchema = schema
        break
      }
      case 'select':
        if (field.id === 'incoterm') {
          fieldSchema = z.enum(['FOB', 'CIF', 'EXW', 'DDP'] as const, {
            required_error: 'Please select an Incoterm',
            invalid_type_error: 'Please select a valid Incoterm'
          })
        } else if (field.id === 'payment_method') {
          fieldSchema = z.enum(['bank_transfer', 'letter_of_credit'] as const, {
            required_error: 'Please select a payment method',
            invalid_type_error: 'Please select a valid payment method'
          })
        } else if (field.id === 'unit') {
          fieldSchema = z.enum(['kg', 'box', 'piece', 'litre'] as const, {
            required_error: 'Please select a unit',
            invalid_type_error: 'Please select a valid unit'
          })
        } else {
          fieldSchema = z.string({
            required_error: `Please select a ${field.label.toLowerCase()}`,
            invalid_type_error: `Please select a valid ${field.label.toLowerCase()}`
          })
        }
        break
      case 'date': {
        const tomorrow = startOfDay(addDays(new Date(), 1))

        fieldSchema = z.coerce.date({
          required_error: `${field.label} is required`,
          invalid_type_error: `Please enter a valid date`
        }).refine(
          date => {
            const selectedDate = startOfDay(date)
            return selectedDate >= tomorrow
          },
          { message: 'Expected delivery date must be at least tomorrow' }
        )
        break
      }
      case 'textarea':
        fieldSchema = z.string({
          required_error: `${field.label} is required`,
          invalid_type_error: `${field.label} must be text`
        }).max(500, 'Maximum 500 characters allowed')
        break
      default:
        fieldSchema = z.string({
          required_error: `${field.label} is required`,
          invalid_type_error: `${field.label} must be text`
        })
    }

    schemaFields[field.id] = field.required 
      ? fieldSchema 
      : fieldSchema.optional()
  })

  return z.object(schemaFields)
}

export type OrderFormData = z.infer<ReturnType<typeof generateOrderSchema>> 

