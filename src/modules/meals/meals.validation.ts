import { z } from "zod";

const createMealSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  image_url: z.string().url("Invalid image URL"),
  category_id: z.string().uuid("Invalid category ID"),
  rating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  orderCount: z.number().int().min(0).optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  offerText: z.string().optional().nullable(),
  offerExpiresAt: z.string().datetime().optional().nullable(),
  isDiscounted: z.boolean().optional(),
  preparationTime: z.string().optional().nullable(),
  calories: z.number().int().positive().optional().nullable(),
  spiceLevel: z.enum(["NONE", "MILD", "MEDIUM", "HOT", "EXTRA_HOT"]).optional().nullable(),
  servingSize: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  ingredients: z.array(z.string()).optional(),
});

const updateMealSchema = createMealSchema.partial();

const updateDiscountSchema = z.object({
  discountPercent: z.number().int().min(0).max(100).optional(),
  offerText: z.string().optional().nullable(),
  offerExpiresAt: z.string().datetime().optional().nullable(),
  isDiscounted: z.boolean().optional(),
});

export const MealsValidation = {
  createMealSchema,
  updateMealSchema,
  updateDiscountSchema,
};
