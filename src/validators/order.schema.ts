// FILE: src/validators/order.schema.ts
import { z } from 'zod';

export const AddressSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian phone number is required'),
  addressLine1: z.string().min(5, 'Address line 1 is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN code is required'),
});

export const CheckoutInputSchema = z.object({
  addressId: z.string().optional(),
  newAddress: AddressSchema.optional(),
  notes: z.string().max(500).optional(),
}).refine(data => data.addressId || data.newAddress, {
  message: 'Either a saved address ID or a new address must be provided',
  path: ['addressId'],
});

export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
