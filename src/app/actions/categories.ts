"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
})

export async function createCategory(formData: FormData) {
    const businessId = await getCurrentBusinessId()

    const name = formData.get("name") as string

    if (!name) return

    try {
        await prisma.category.create({
            data: {
                name,
                businessId,
            }
        })
        revalidatePath("/products/categories")
        revalidatePath("/products/new") // Update product form dropdown
    } catch (error) {
        console.error("Failed to create category", error)
        // Handle duplicate name error if needed
    }
}
