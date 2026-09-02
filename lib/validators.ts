import { z } from "zod";

// Customer validators
export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

// Product validators
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  cost: z.number().positive("Cost must be positive"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Order validators
export const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  taxAmount: z.number().default(0),
  discountAmount: z.number().default(0),
  notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Expense validators
export const createExpenseSchema = z.object({
  category: z.enum([
    "RENT",
    "UTILITIES",
    "PAYROLL",
    "SUPPLIES",
    "EQUIPMENT",
    "MARKETING",
    "INSURANCE",
    "MAINTENANCE",
    "SHIPPING",
    "SOFTWARE",
    "OTHER",
  ]),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
  date: z.coerce.date(),
  notes: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

// Campaign validators
export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  audience: z.string().optional(),
  offer: z.string().optional(),
  message: z.string().optional(),
  channel: z.enum(["email", "sms", "social", "in-app"]).optional(),
  scheduledFor: z.coerce.date().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
