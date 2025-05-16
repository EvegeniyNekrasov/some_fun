import { z } from "zod";

/**
 * Authenticatrion schema for login
 */
export const AuthLoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

/**
 * Authenticatrion schema for registration
 */
export const AuthRegisterSchema = z.object({
    username: z.string(),
    email: z.string(),
    passowrd: z.string(),
});

export const AuthResponse = z.object({
    token: z.string(),
});

export type AuthLogin = z.infer<typeof AuthLoginSchema>;
export type AuthRegister = z.infer<typeof AuthRegisterSchema>;
