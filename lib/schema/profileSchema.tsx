import * as z from 'zod';
import { FormField } from '@/components/shared/DynamicForm';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    production_capacity: z.string().optional(),
    certifications: z.string().optional(),
    main_markets: z.string().optional(),
    year_established: z.string().optional(),
    number_of_employees: z.string().optional(),
    business_type: z.string().optional(),
    social_media: z.object({
      linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal(''))
    }).optional()
  }).optional().nullable(),
  avatar_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported')
    .optional()
});

// Form field configurations for the DynamicForm component
export const profileFormFields: FormField[] = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
    description: "Your legal first name"
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
    description: "Your legal last name"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Your primary contact email"
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "phone",
    placeholder: "Enter your phone number",
    required: true,
    description: "Your primary contact number"
  },
  {
    name: "designation",
    label: "Designation",
    type: "text",
    placeholder: "Enter your designation",
    description: "Your role or position in the company"
  },
  {
    name: "business_category",
    label: "Business Category",
    type: "select",
    placeholder: "Select business category",
    description: "Primary category of your business",
    required: true,
    options: [] // Will be populated dynamically from the categories table
  }
];

export const companyFormFields: FormField[] = [
  {
    name: "company_profile.company_name",
    label: "Company Name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
    description: "Legal name of your company"
  },
  {
    name: "company_profile.company_address",
    label: "Company Address",
    type: "textarea",
    placeholder: "Enter company address",
    required: true,
    description: "Full registered address of your company",
    rows: 3
  },
  {
    name: "company_profile.company_description",
    label: "Company Description",
    type: "textarea",
    placeholder: "Enter company description",
    required: true,
    description: "Brief overview of your company and its activities",
    rows: 5
  },
  {
    name: "company_profile.website",
    label: "Website",
    type: "url",
    placeholder: "Enter company website",
    description: "Your company's official website"
  },
  {
    name: "company_profile.production_capacity",
    label: "Production Capacity",
    type: "text",
    placeholder: "Enter production capacity",
    description: "Your company's production capabilities"
  },
  {
    name: "company_profile.certifications",
    label: "Certifications",
    type: "text",
    placeholder: "Enter certifications",
    description: "List of your company's certifications"
  },
  {
    name: "company_profile.main_markets",
    label: "Main Markets",
    type: "text",
    placeholder: "Enter main markets",
    description: "Primary markets where you operate"
  },
  {
    name: "company_profile.year_established",
    label: "Year Established",
    type: "date",
    placeholder: "Select year established",
    description: "When your company was founded"
  },
  {
    name: "company_profile.number_of_employees",
    label: "Number of Employees",
    type: "select",
    placeholder: "Select number of employees",
    description: "Size of your workforce",
    options: [
      { label: "1-10", value: "1-10" },
      { label: "11-50", value: "11-50" },
      { label: "51-200", value: "51-200" },
      { label: "201-500", value: "201-500" },
      { label: "501-1000", value: "501-1000" },
      { label: "1000+", value: "1000+" }
    ]
  },
  {
    name: "company_profile.business_type",
    label: "Business Type",
    type: "select",
    placeholder: "Select business type",
    description: "Type of your business entity",
    options: [
      { label: "Manufacturer", value: "Manufacturer" },
      { label: "Trading Company", value: "Trading Company" },
      { label: "Distributor/Wholesaler", value: "Distributor/Wholesaler" },
      { label: "Service Provider", value: "Service Provider" },
      { label: "Other", value: "Other" }
    ]
  },
  {
    name: "company_profile.social_media.linkedin",
    label: "LinkedIn Profile",
    type: "url",
    placeholder: "Enter LinkedIn profile URL",
    description: "Your company's LinkedIn page"
  },
  {
    name: "company_profile.social_media.twitter",
    label: "Twitter Profile",
    type: "url",
    placeholder: "Enter Twitter profile URL",
    description: "Your company's Twitter page"
  },
  {
    name: "company_profile.social_media.facebook",
    label: "Facebook Profile",
    type: "url",
    placeholder: "Enter Facebook profile URL",
    description: "Your company's Facebook page"
  }
];

export type ProfileFormData = z.infer<typeof ProfileSchema>; 