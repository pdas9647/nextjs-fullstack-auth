import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "@auth/core/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                name: {label: "Name", type: "text"},
                email: {label: "Email", type: "email", placeholder: "Email"},
                code: {label: "Verification Code", type: "text", placeholder: "123456"},
            },
            async authorize(credentials) {
                let user = null;

                const dbCode = '455255';
                credentials.name = 'Padma';

                if (!credentials.email || !credentials.code) {
                    console.error("Invalid code ❌");
                    throw new Error('missingEmailCode');
                    // return null;
                }

                // validate credentials
                const isCodeMatched = dbCode === credentials.code;
                if (!isCodeMatched) {
                    console.error("Invalid code ❌");
                    return null;
                }

                if (!credentials.name) {
                    console.error("Name missing ❌");
                    throw new Error('missingName');
                    // return null;
                }

                // get user
                user = {
                    id: '1',
                    name: 'Padmanabha Das',
                    email: 'padmanabhadas9647@gmail.com',
                    code: "455255"
                }

                if (!user) {
                    console.log("User not found");
                    return null;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        authorized({ request: { nextUrl }, auth }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;
            if (pathname.startsWith('/auth/signin') && isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            return !!auth;
        },

        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },

        session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin"
    }
})
