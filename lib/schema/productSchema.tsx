import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ProductSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(100, 'Headline must be 100 characters or less'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(
    z.object({
      file: z.instanceof(File)
        .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported'),
      preview: z.string().url()
    })
  ).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  pricing: z.array(z.object({
    minOrder: z.coerce.number().min(1, "Minimum order must be at least 1"),
    maxOrder: z.coerce.number().optional().refine(val => val === undefined || val > 0, "Maximum order must be greater than 0"),
    price: z.coerce.number().min(0.01, "Price must be greater than 0")
  })).min(1, "At least one pricing tier is required"),
  specifications: z.array(z.object({
    name: z.string().min(1, "Specification name is required"),
    value: z.string().min(1, "Specification value is required")
  })),
  variations: z.array(z.object({
    name: z.string().min(1, "Variation name is required"),
    options: z.string().min(1, "At least one option is required")
      .transform(val => {
        const options = val.split(',').map(v => v.trim()).filter(Boolean);
        if (options.length === 0) throw new Error("At least one option is required");
        return options;
      })
  })).optional(),
  packaging: z.object({
    unit: z.string().min(1, "Packaging unit is required"),
    size: z.object({
      length: z.coerce.number().min(0, "Length must be a non-negative number"),
      width: z.coerce.number().min(0, "Width must be a non-negative number"),
      height: z.coerce.number().min(0, "Height must be a non-negative number"),
      unit: z.string().min(1, "Unit is required")
    }),
    weight: z.object({
      value: z.coerce.number().min(0, "Weight must be a non-negative number"),
      unit: z.string().min(1, "Unit is required")
    })
  }),
  shipping_info: z.object({
    leadTime: z.string().min(1, "Lead time is required"),
    shippingMethods: z.array(z.string()).min(1, "At least one shipping method is required")
  }),
  customization: z.object({
    isAvailable: z.boolean(),
    options: z.array(z.string()).optional().nullable()
      .transform(val => val ? val.flatMap(v => v.split(',').map(o => o.trim()).filter(Boolean)) : undefined)
  })
});

export type ProductFormData = z.infer<typeof ProductSchema>;