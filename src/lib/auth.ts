import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-min-32-chars-12345678901234567890",
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("Missing credentials")
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        },
                        include: {
                            business: true
                        }
                    })

                    if (!user) {
                        console.log("User not found:", credentials.email)
                        return null
                    }

                    if (!user.password) {
                        console.log("User has no password")
                        return null
                    }

                    const isPasswordValid = await compare(credentials.password, user.password)

                    if (!isPasswordValid) {
                        console.log("Invalid password")
                        return null
                    }

                    console.log("Login successful for:", user.email, "BusinessId:", user.businessId, "Role:", user.role)
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role as string,
                        businessId: user.businessId,
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id as string,
                        role: token.role as string,
                        businessId: token.businessId as string,
                    }
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                    businessId: user.businessId,
                }
            }
            return token
        }
    }
}
