import * as z from 'zod';
import { FormField } from '@/components/shared/DynamicForm';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Company profile schema for validation
export const CompanySchema = z.object({
  company_profile: z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    company_address: z.string().min(5, 'Address must be at least 5 characters'),
    company_description: z.string().min(10, 'Description must be at least 10 characters'),
    company_logo_url: z.string().url().optional().nullable(),
    company_poster_url: z.string().url().optional().nullable(),
    overview: z.object({
      mainProducts: z.string().optional(),
      totalEmployees: z.coerce.number().positive().optional(),
      yearsExporting: z.coerce.number().nonnegative().optional(),
      yearEstablished: z.string().optional()
    }).optional().default({}),
    productionCapacity: z.object({
      factorySize: z.coerce.number().positive().optional(),
      annualOutput: z.coerce.number().positive().optional(),
      productionLines: z.coerce.number().positive().optional(),
      qualityControlStaff: z.coerce.number().positive().optional()
    }).optional().default({}),
    social_media: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal(''))
    }).optional().default({})
  })
});

// Base profile schema for validation
export const ProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  designation: z.string().optional(),
  business_category: z.string().min(2, 'Business category is required'),
  avatar_url: z.string().url().optional().nullable(),
  company_profile: z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    company_address: z.string().min(5, 'Address must be at least 5 characters'),
    company_description: z.string().min(10, 'Description must be at least 10 characters'),
    company_logo_url: z.string().url().optional().nullable(),
    company_poster_url: z.string().url().optional().nullable(),
    overview: z.object({
      mainProducts: z.string().optional(),
      totalEmployees: z.coerce.number().positive().optional(),
      yearsExporting: z.coerce.number().nonnegative().optional(),
      yearEstablished: z.string().optional()
    }).optional().default({}),
    productionCapacity: z.object({
      factorySize: z.coerce.number().positive().optional(),
      annualOutput: z.coerce.number().positive().optional(),
      productionLines: z.coerce.number().positive().optional(),
      qualityControlStaff: z.coerce.number().positive().optional()
    }).optional().default({}),
    social_media: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal(''))
    }).optional().default({})
  }).optional().default({
    company_name: '',
    company_address: '',
    company_description: '',
    company_logo_url: null,
    company_poster_url: null,
    overview: {},
    productionCapacity: {},
    social_media: {}
  }),
  avatar_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported')
    .optional()
});

// Form field configurations for the DynamicForm component
export const profileFormFields: FormField[] = [
  {
    label: "First Name",
    name: "first_name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
    description: "Your legal first name"
  },
  {
    label: "Last Name",
    name: "last_name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
    description: "Your legal last name"
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Your primary contact email"
  },
  {
    label: "Phone Number",
    name: "phone_number",
    type: "phone",
    placeholder: "Enter your phone number",
    required: true,
    description: "Your primary contact number"
  },
  {
    label: "Designation",
    name: "designation",
    type: "text",
    placeholder: "Enter your designation",
    description: "Your role or position in the company"
  },
  {
    label: "Business Category",
    name: "business_category",
    type: "select",
    placeholder: "Select business category",
    description: "Primary category of your business",
    required: true,
    options: [] // Will be populated dynamically from the categories table
  }
];

export const companyFormFields: FormField[] = [
  {
    label: "Company Name",
    name: "company_profile.company_name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
    description: "Legal name of your company"
  },
  {
    label: "Company Address",
    name: "company_profile.company_address",
    type: "textarea",
    placeholder: "Enter company address",
    required: true,
    description: "Full registered address of your company",
    rows: 3
  },
  {
    label: "Company Description",
    name: "company_profile.company_description",
    type: "textarea",
    placeholder: "Enter company description",
    required: true,
    description: "Brief overview of your company and its activities",
    rows: 5
  },
  {
    label: "Main Products",
    name: "company_profile.overview.mainProducts",
    type: "text",
    placeholder: "Enter main products",
    description: "Your company's main products"
  },
  {
    label: "Total Employees",
    name: "company_profile.overview.totalEmployees",
    type: "number",
    placeholder: "Enter total number of employees",
    description: "Total number of employees in your company",
    min: 1
  },
  {
    label: "Years Exporting",
    name: "company_profile.overview.yearsExporting",
    type: "number",
    placeholder: "Enter years of exporting experience",
    description: "Number of years in export business",
    min: 0
  },
  {
    label: "Year Established",
    name: "company_profile.overview.yearEstablished",
    type: "date",
    placeholder: "Select year established",
    description: "Year your company was established",
    className: "w-full",
    calendarProps: {
      mode: "single",
      captionLayout: "dropdown",
      fromYear: 1900,
      toYear: new Date().getFullYear(),
      defaultMonth: new Date(2000, 0),
      showOutsideDays: false,
      fixedWeeks: true,
      classNames: {
        caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-sm font-medium text-brand-200",
        nav: "space-x-1 flex items-center",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm relative [&:has([aria-selected])]:bg-brand-100/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-brand-100/10 hover:text-brand-200",
        day_selected: "bg-brand-200 text-white hover:bg-brand-200 hover:text-white focus:bg-brand-200 focus:text-white",
        day_today: "bg-brand-100/10 text-brand-200",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        dropdown: "p-2",
        caption_dropdowns: "flex gap-2 justify-center items-center",
        dropdown_month: "relative inline-flex items-center",
        dropdown_year: "relative inline-flex items-center",
        dropdown_icon: "h-4 w-4 text-brand-200"
      }
    }
  },
  {
    label: "Factory Size (sqm)",
    name: "company_profile.productionCapacity.factorySize",
    type: "number",
    placeholder: "Enter factory size in square meters",
    description: "Size of your production facility",
    min: 1
  },
  {
    label: "Annual Output",
    name: "company_profile.productionCapacity.annualOutput",
    type: "number",
    placeholder: "Enter annual production output",
    description: "Your yearly production capacity",
    min: 1
  },
  {
    label: "Production Lines",
    name: "company_profile.productionCapacity.productionLines",
    type: "number",
    placeholder: "Enter number of production lines",
    description: "Number of active production lines",
    min: 1
  },
  {
    label: "Quality Control Staff",
    name: "company_profile.productionCapacity.qualityControlStaff",
    type: "number",
    placeholder: "Enter number of QC staff",
    description: "Number of quality control personnel",
    min: 1
  },
  {
    label: "LinkedIn Profile",
    name: "company_profile.social_media.linkedin",
    type: "url",
    placeholder: "Enter LinkedIn profile URL",
    description: "Your company's LinkedIn page"
  },
  {
    label: "Twitter Profile",
    name: "company_profile.social_media.twitter",
    type: "url",
    placeholder: "Enter Twitter profile URL",
    description: "Your company's Twitter page"
  },
  {
    label: "Facebook Profile",
    name: "company_profile.social_media.facebook",
    type: "url",
    placeholder: "Enter Facebook profile URL",
    description: "Your company's Facebook page"
  }
];

// Export types
export type ProfileFormData = z.infer<typeof ProfileSchema>;
export type CompanyFormData = z.infer<typeof CompanySchema>; 