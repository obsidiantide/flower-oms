import { z } from "zod";

export const createOrderSchema = z.object({
  customerFullName: z.string().min(1),
  customerPhone: z.string().min(1),
  deliveryDate: z.string().min(1), // ISO date (yyyy-mm-dd)
  deliveryTime: z.string().min(1), // HH:mm
  orderType: z.enum(["PICKUP", "DELIVERY"]),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  amount: z.number().nonnegative(),
  photoUrls: z.array(z.string()).optional(),
});

export const createCustomerSchema = z.object({
  fullName: z.string().min(1, "Ad və soyad tələb olunur"),
  phone: z.string().min(1, "Telefon nömrəsi tələb olunur"),
  email: z.string().email("Düzgün email daxil edin").optional().or(z.literal("")),
  address: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
});
