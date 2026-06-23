import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(30),
});

export const signupSchema = z
  .object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(30),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
