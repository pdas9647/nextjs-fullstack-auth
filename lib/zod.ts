import {object, string} from "zod";

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    code: string({required_error: "Code is required"})
        .min(6, "Code must be of 6 digits")
        .max(6, "Code must be of 6 digits")
});
