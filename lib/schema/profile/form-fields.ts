// Form field interface definition
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'phone' | 'select' | 'textarea' | 'date' | 'url' | 'number';
  placeholder: string;
  required: boolean;
  options?: Array<{
    label: string;
    value: string;
    options?: Array<{
      label: string;
      value: string;
    }>;
  }>;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export const profileFormFields: FormField[] = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "phone",
    placeholder: "Enter phone number with country code",
    required: true,
    validation: {
      pattern: "^\\+[1-9]\\d{1,14}$",
      message: "Please enter a valid phone number with country code (e.g., +1234567890)",
    }
  },
  {
    name: "business_category",
    label: "Business Category",
    type: "select",
    placeholder: "Select your business category",
    required: false,
    options: [], // This will be populated dynamically
  },
  {
    name: "designation",
    label: "Designation",
    type: "text",
    placeholder: "Enter your designation",
    required: false,
  },
];

export const companyFormFields: FormField[] = [
  {
    name: "company_profile.company_name",
    label: "Company Name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
  },
  {
    name: "company_profile.company_address",
    label: "Company Address",
    type: "textarea",
    placeholder: "Enter company address",
    required: true,
  },
  {
    name: "company_profile.company_description",
    label: "Company Description",
    type: "textarea",
    placeholder: "Enter company description",
    required: true,
  },
  {
    name: "company_profile.overview.mainProducts",
    label: "Main Products",
    type: "text",
    placeholder: "Enter main products (comma separated)",
    required: true,
  },
  {
    name: "company_profile.overview.totalEmployees",
    label: "Total Employees",
    type: "number",
    placeholder: "Enter total number of employees",
    required: true,
  },
  {
    name: "company_profile.overview.dateEstablished",
    label: "Date Established",
    type: "date",
    placeholder: "Select establishment date",
    required: true,
  },
  {
    name: "company_profile.overview.industry",
    label: "Industry",
    type: "text",
    placeholder: "Enter your industry",
    required: true,
  },
  {
    name: "company_profile.productionCapacity.factorySize",
    label: "Factory Size (sqm)",
    type: "number",
    placeholder: "Enter factory size",
    required: false,
  },
  {
    name: "company_profile.productionCapacity.annualOutput",
    label: "Annual Output",
    type: "number",
    placeholder: "Enter annual output",
    required: false,
  },
  {
    name: "company_profile.productionCapacity.productionLines",
    label: "Production Lines",
    type: "number",
    placeholder: "Enter number of production lines",
    required: false,
  },
  {
    name: "company_profile.productionCapacity.qualityControlStaff",
    label: "Quality Control Staff",
    type: "number",
    placeholder: "Enter number of QC staff",
    required: false,
  },
  {
    name: "company_profile.social_media.linkedin",
    label: "LinkedIn",
    type: "url",
    placeholder: "Enter LinkedIn profile URL",
    required: false,
  },
  {
    name: "company_profile.social_media.twitter",
    label: "Twitter",
    type: "url",
    placeholder: "Enter Twitter profile URL",
    required: false,
  },
  {
    name: "company_profile.social_media.facebook",
    label: "Facebook",
    type: "url",
    placeholder: "Enter Facebook profile URL",
    required: false,
  },
]; 