import { z } from "zod";

export const envSchema = z.object({
  DATABASE_USER: z.string().min(3),
  DATABASE_PASSWORD: z.string().min(3),
  DATABASE_NAME: z.string().min(3),
  DATABASE_HOST: z.string().min(3),
  DATABASE_PORT: z.string().transform(Number).pipe(z.number()),
  DATABASE_POOLSIZE: z
    .string()
    .transform(Number)
    .pipe(z.number())
    .optional()
    .default("50"),
});

export type ENV = z.infer<typeof envSchema>;
