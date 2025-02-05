import * as z from "zod";
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode } from 'libphonenumber-js';

// Helper function to validate phone number and extract country
const validatePhoneNumber = (value: string) => {
  try {
    if (!isValidPhoneNumber(value)) {
      return false;
    }
    const phoneNumber = parsePhoneNumber(value);
    return phoneNumber.isValid();
  } catch {
    return false;
  }
};

// Helper function to get country from phone number
export const getCountryFromPhone = (phoneNumber: string) => {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    if (parsed?.country) {
      return parsed.country;
    }
  } catch {
    return null;
  }
  return null;
};

// Profile Schema
export const ProfileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string()
    .min(8, "Phone number is too short")
    .max(15, "Phone number is too long")
    .refine(validatePhoneNumber, {
      message: "Please enter a valid phone number with country code (e.g., +1234567890)",
    }),
  business_category: z.string().optional(),
  designation: z.string().optional(),
});

// Company Schema
export const CompanySchema = z.object({
  company_profile: z.object({
    company_name: z.string().min(2, "Company name must be at least 2 characters"),
    company_address: z.string().min(5, "Address must be at least 5 characters"),
    company_description: z.string().min(10, "Description must be at least 10 characters"),
    overview: z.object({
      mainProducts: z.string(),
      totalEmployees: z.string(),
      dateEstablished: z.string(),
      industry: z.string(),
    }),
    productionCapacity: z.object({
      factorySize: z.string().optional(),
      annualOutput: z.string().optional(),
      productionLines: z.string().optional(),
      qualityControlStaff: z.string().optional(),
    }),
    social_media: z.object({
      linkedin: z.string().url("Invalid LinkedIn URL").optional(),
      twitter: z.string().url("Invalid Twitter URL").optional(),
      facebook: z.string().url("Invalid Facebook URL").optional(),
    }),
  }),
});

// Types
export type ProfileFormValues = z.infer<typeof ProfileSchema>;
export type CompanyFormValues = z.infer<typeof CompanySchema>; 