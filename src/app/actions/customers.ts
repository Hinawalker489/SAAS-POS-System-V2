"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"

const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
})

export async function createCustomer(formData: FormData) {
    const businessId = await getCurrentBusinessId()

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    }

    const validatedData = customerSchema.parse(rawData)

    await prisma.customer.create({
        data: {
            ...validatedData,
            businessId,
        }
    })

    revalidatePath("/customers")
    redirect("/customers")
}

export async function updateCustomer(formData: FormData) {
    const businessId = await getCurrentBusinessId()
    const customerId = formData.get("customerId")

    if (!customerId || typeof customerId !== "string") {
        throw new Error("Missing customer ID")
    }

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    }

    const validatedData = customerSchema.parse(rawData)

    const existing = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { businessId: true },
    })

    if (!existing || existing.businessId !== businessId) {
        throw new Error("Customer not found")
    }

    await prisma.customer.update({
        where: { id: customerId },
        data: {
            ...validatedData,
        },
    })

    revalidatePath(`/customers/${customerId}/edit`)
    revalidatePath("/customers")
    redirect("/customers")
}