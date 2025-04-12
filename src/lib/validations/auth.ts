import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const customerRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  address: z.string().optional(),
  profileImage: z.any().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const agencyRegistrationSchema = z.object({
  agencyName: z.string()
    .min(2, 'Agency name must be at least 2 characters')
    .max(100, 'Agency name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&]*$/, 'Agency name can only contain letters, numbers, spaces, hyphens, and ampersands'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  logo: z.any()
    .refine((file) => !file || (file instanceof FileList && file.length > 0), {
      message: 'Logo is required',
    })
    .refine((file) => {
      if (!file || !(file instanceof FileList) || file.length === 0) return true;
      const fileSize = file[0].size / 1024 / 1024; // Convert to MB
      return fileSize <= 5; // 5MB limit
    }, 'Logo file size must be less than 5MB')
    .refine((file) => {
      if (!file || !(file instanceof FileList) || file.length === 0) return true;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return allowedTypes.includes(file[0].type);
    }, 'Logo must be a JPEG, PNG, or GIF file'),
  galleryImages: z.any()
    .refine((files) => !files || (files instanceof FileList && files.length > 0), {
      message: 'At least one gallery image is required',
    })
    .refine((files) => {
      if (!files || !(files instanceof FileList) || files.length === 0) return true;
      return Array.from(files).every(file => {
        const fileSize = file.size / 1024 / 1024;
        return fileSize <= 5;
      });
    }, 'Each gallery image must be less than 5MB')
    .refine((files) => {
      if (!files || !(files instanceof FileList) || files.length === 0) return true;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return Array.from(files).every(file => allowedTypes.includes(file.type));
    }, 'Gallery images must be JPEG, PNG, or GIF files')
    .refine((files) => {
      if (!files || !(files instanceof FileList)) return true;
      return files.length <= 10;
    }, 'Maximum 10 gallery images allowed'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}); 