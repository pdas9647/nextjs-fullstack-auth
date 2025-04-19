"use server";

import {signIn, signOut} from "@/auth";
import {AuthError} from "next-auth";

export async function handleCredentialsSignin({email, code}: { email: string, code: string }) {
    try {
        await signIn("credentials", {email, code, redirectTo: "/"});
    } catch (error) {
        if (error instanceof AuthError) {
            console.log('error type:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return {message: 'Invalid credentials'};
                case 'AccessDenied':
                    return {message: 'Access denied'};
                case 'Verification':
                    return {message: 'Verification failed'};
                case 'CallbackRouteError':
                    if (error.cause?.err?.message === 'missingEmailCode') {
                        return {message: 'Email & Code must be valid'};
                    } else if (error.cause?.err?.message === 'missingName') {
                        return {message: 'Name is required'};
                    }
                    return {message: 'Wrong callback route'};
                default:
                    return {message: 'Something went wrong'};
            }
        }
        throw error;
    }
}

export async function handleGoogleSignin() {
    await signIn("google", {redirectTo: "/"});
}

export async function handleSignOut() {
    await signOut();
}
