import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().min(2).max(100).trim(),
  type: z.enum(["player", "school", "coach"]).optional(),
});
export type SearchInput = z.infer<typeof searchSchema>;

export const playerIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Must be a numeric ID").transform(Number),
});
export type PlayerIdInput = z.infer<typeof playerIdSchema>;

export const sendConfirmationEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
});
export type SendConfirmationEmailInput = z.infer<typeof sendConfirmationEmailSchema>;

export const aiRecapSchema = z.object({
  gameIds: z
    .array(z.string().regex(/^\d+$/, "Must be numeric IDs"))
    .min(1, "At least one game ID is required"),
});
export type AiRecapInput = z.infer<typeof aiRecapSchema>;

export const aiSummarySchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  body: z.string().min(1, "Body is required").max(50000),
});
export type AiSummaryInput = z.infer<typeof aiSummarySchema>;
