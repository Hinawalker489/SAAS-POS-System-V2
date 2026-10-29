"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId, getCurrentUser } from "@/lib/auth-helper"

const expenseSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional(),
    date: z.date().optional(),
})

export async function createExpense(data: z.infer<typeof expenseSchema>) {
    const businessId = await getCurrentBusinessId()
    const user = await getCurrentUser()

    if (!user?.id) {
        throw new Error("User not authenticated")
    }

    const validatedData = expenseSchema.parse(data)

    const expense = await prisma.expense.create({
        data: {
            businessId,
            userId: user.id,
            category: validatedData.category,
            amount: validatedData.amount,
            description: validatedData.description,
            date: validatedData.date || new Date(),
        }
    })

    revalidatePath("/expenses")

    return { success: true, expenseId: expense.id }
}
