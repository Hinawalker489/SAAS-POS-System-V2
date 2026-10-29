"use server"

import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"

const registerSchema = z
    .object({
        businessName: z.string().min(2, "Business name must be at least 2 characters"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    })

export type RegisterInput = z.infer<typeof registerSchema>

export async function registerUser(input: RegisterInput) {
    const parsed = registerSchema.safeParse(input)

    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0]?.message ?? "Invalid input",
        }
    }

    const { businessName, name, email, password } = parsed.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    })

    if (existingUser) {
        return {
            success: false,
            error: "An account with this email already exists",
        }
    }

    const hashedPassword = await hash(password, 12)

    await prisma.business.create({
        data: {
            name: businessName,
            currency: "USD",
            users: {
                create: {
                    email,
                    name,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            },
        },
    })

    return { success: true }
}

