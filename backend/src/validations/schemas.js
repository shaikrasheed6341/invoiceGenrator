import { z } from 'zod';

// User Registration Schema
export const userRegistrationSchema = z.object({
  firstname: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastname: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  email: z.string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});

// User Login Schema
export const userLoginSchema = z.object({
  email: z.string()
    .email("Invalid email format"),
  password: z.string()
    .min(1, "Password is required")
});

// Owner Schema
export const ownerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .email("Invalid email format"),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number")
    .optional(),
  gstNumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional(),
  compneyname: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  recipientName: z.string()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name must be less than 100 characters")
    .optional(),
  houseNumber: z.string()
    .min(1, "House number is required")
    .max(20, "House number must be less than 20 characters")
    .optional(),
  streetName: z.string()
    .min(2, "Street name must be at least 2 characters")
    .max(100, "Street name must be less than 100 characters")
    .optional(),
  locality: z.string()
    .min(2, "Locality must be at least 2 characters")
    .max(100, "Locality must be less than 100 characters")
    .optional(),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .optional(),
  pinCode: z.string()
    .regex(/^[1-9][0-9]{5}$/, "PIN code must be a valid 6-digit number")
    .optional(),
  state: z.string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be less than 50 characters")
    .optional()
});

// Customer Schema
export const customerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number"),
  gstnumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional(),
  pannumber: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
    .optional(),
  recipientName: z.string()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name must be less than 100 characters")
    .optional(),
  houseNumber: z.string()
    .min(1, "House number is required")
    .max(20, "House number must be less than 20 characters")
    .optional(),
  streetName: z.string()
    .min(2, "Street name must be at least 2 characters")
    .max(100, "Street name must be less than 100 characters")
    .optional(),
  locality: z.string()
    .min(2, "Locality must be at least 2 characters")
    .max(100, "Locality must be less than 100 characters")
    .optional(),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .optional(),
  pinCode: z.string()
    .regex(/^[1-9][0-9]{5}$/, "PIN code must be a valid 6-digit number")
    .optional(),
  state: z.string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be less than 50 characters")
    .optional()
});

// Item Schema
export const itemSchema = z.object({
  name: z.string()
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  price: z.number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  quantity: z.number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be a positive number")
    .min(1, "Quantity must be at least 1"),
  unit: z.string()
    .min(1, "Unit is required")
    .max(20, "Unit must be less than 20 characters")
    .optional(),
  hsnCode: z.string()
    .regex(/^[0-9]{4,8}$/, "HSN code must be 4-8 digits")
    .optional(),
  gstRate: z.number()
    .min(0, "GST rate must be 0 or greater")
    .max(28, "GST rate cannot exceed 28%")
    .optional()
});

// Quotation Item Schema
export const quotationItemSchema = z.object({
  itemId: z.string()
    .uuid("Invalid item ID format"),
  quantity: z.number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be a positive number")
    .min(1, "Quantity must be at least 1"),
  price: z.number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  discount: z.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
});

// Quotation Schema
export const quotationSchema = z.object({
  customerId: z.string()
    .uuid("Invalid customer ID format"),
  bankdetailsId: z.string()
    .uuid("Invalid bank details ID format")
    .optional(),
  items: z.array(quotationItemSchema)
    .min(1, "At least one item is required"),
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  terms: z.string()
    .max(1000, "Terms must be less than 1000 characters")
    .optional(),
  validUntil: z.string()
    .datetime("Invalid date format")
    .optional()
});

// Bank Details Schema
export const bankDetailsSchema = z.object({
  accountHolderName: z.string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must be less than 100 characters"),
  accountNumber: z.string()
    .regex(/^[0-9]{9,18}$/, "Account number must be 9-18 digits"),
  ifscCode: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  bankName: z.string()
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name must be less than 100 characters"),
  branchName: z.string()
    .min(2, "Branch name must be at least 2 characters")
    .max(100, "Branch name must be less than 100 characters")
    .optional(),
  upiId: z.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/, "Invalid UPI ID format")
    .optional()
});

// Payment Schema
export const paymentSchema = z.object({
  quotationId: z.string()
    .uuid("Invalid quotation ID format"),
  amount: z.number()
    .positive("Amount must be a positive number")
    .min(0.01, "Amount must be at least 0.01"),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHEQUE", "UPI", "CARD", "OTHER"]),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]),
  transactionId: z.string()
    .max(100, "Transaction ID must be less than 100 characters")
    .optional(),
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
});

// Payment Reminder Schema
export const paymentReminderSchema = z.object({
  quotationId: z.string()
    .uuid("Invalid quotation ID format"),
  reminderType: z.enum(["EMAIL", "SMS", "CALL", "WHATSAPP"]),
  scheduledDate: z.string()
    .datetime("Invalid date format"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  status: z.enum(["SCHEDULED", "SENT", "FAILED", "CANCELLED"])
});

// Analytics Query Schema
export const analyticsQuerySchema = z.object({
  startDate: z.string()
    .datetime("Invalid start date format")
    .optional(),
  endDate: z.string()
    .datetime("Invalid end date format")
    .optional(),
  period: z.enum(["daily", "weekly", "monthly", "yearly"])
    .optional()
});

// Update schemas (partial versions for updates)
export const updateOwnerSchema = ownerSchema.partial();
export const updateCustomerSchema = customerSchema.partial();
export const updateItemSchema = itemSchema.partial();
export const updateBankDetailsSchema = bankDetailsSchema.partial();

// Phone number validation for route parameters
export const phoneParamSchema = z.object({
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number")
});

// ID validation for route parameters
export const idParamSchema = z.object({
  id: z.string()
    .uuid("Invalid ID format")
});

// Search query schema
export const searchQuerySchema = z.object({
  query: z.string()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters"),
  limit: z.number()
    .int("Limit must be a whole number")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10)
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number()
    .int("Page must be a whole number")
    .min(1, "Page must be at least 1")
    .optional()
    .default(1),
  limit: z.number()
    .int("Limit must be a whole number")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10)
});

// Export all schemas
export default {
  userRegistrationSchema,
  userLoginSchema,
  ownerSchema,
  customerSchema,
  itemSchema,
  quotationItemSchema,
  quotationSchema,
  bankDetailsSchema,
  paymentSchema,
  paymentReminderSchema,
  analyticsQuerySchema,
  updateOwnerSchema,
  updateCustomerSchema,
  updateItemSchema,
  updateBankDetailsSchema,
  phoneParamSchema,
  idParamSchema,
  searchQuerySchema,
  paginationSchema
}; 