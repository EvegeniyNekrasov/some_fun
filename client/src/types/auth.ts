import { z } from "zod";

/**
 * Authenticatrion schema for login
 */
export const AuthLoginSchema = z.object({
    user: z.string(),
    password: z.string(),
});

/**
 * Authenticatrion schema for registration
 */
export const AuthRegisterSchema = z.object({
    user: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
});

export const AuthResponse = z.object({
    token: z.string(),
    userId: z.number(),
});

export type AuthLogin = z.infer<typeof AuthLoginSchema>;
export type AuthRegister = z.infer<typeof AuthRegisterSchema>;
