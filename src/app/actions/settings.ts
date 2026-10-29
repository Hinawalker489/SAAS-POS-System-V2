"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { revalidatePath } from "next/cache"

const businessSchema = z.object({
    name: z.string().min(2, "Business name must be at least 2 characters"),
    currency: z.string().min(1, "Currency is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
})

export async function updateBusiness(formData: FormData) {
    const businessId = await getCurrentBusinessId()

    const rawData = {
        name: formData.get("name"),
        currency: formData.get("currency"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    }

    const validated = businessSchema.parse(rawData)

    await prisma.business.update({
        where: { id: businessId },
        data: {
            name: validated.name,
            currency: validated.currency,
            email: validated.email || null,
            phone: validated.phone || null,
            address: validated.address || null,
        },
    })

    revalidatePath("/settings")
}

