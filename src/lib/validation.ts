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

// ============================================================================
// MEDIA SCHEMAS
// ============================================================================

export const mediaCategoryEnum = z.enum([
  "game_action",
  "headshot",
  "team_photo",
  "highlight_clip",
  "recap",
  "other",
]);

export const mediaUploadSchema = z.object({
  category: mediaCategoryEnum,
  caption: z.string().max(500).optional(),
  sport: z.string().optional(),
  game_id: z
    .string()
    .regex(/^\d+$/, "Must be a numeric ID")
    .transform(Number)
    .optional(),
  school_id: z
    .string()
    .regex(/^\d+$/, "Must be a numeric ID")
    .transform(Number)
    .optional(),
  season_id: z
    .string()
    .regex(/^\d+$/, "Must be a numeric ID")
    .transform(Number)
    .optional(),
  player_id: z
    .string()
    .regex(/^\d+$/, "Must be a numeric ID")
    .transform(Number)
    .optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});
export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;

export const mediaQuerySchema = z.object({
  game_id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional(),
  school_id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional(),
  player_id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional(),
  sport: z.string().optional(),
  media_type: z.enum(["photo", "video"]).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(1),
  per_page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .default(20),
});
export type MediaQueryInput = z.infer<typeof mediaQuerySchema>;

export const mediaModerationSchema = z
  .object({
    action: z.enum(["approve", "reject"]),
    reason: z.string().max(500).optional(),
  })
  .refine(
    (data) => data.action !== "reject" || (data.reason && data.reason.length > 0),
    { message: "Reason is required when rejecting media", path: ["reason"] }
  );
export type MediaModerationInput = z.infer<typeof mediaModerationSchema>;
