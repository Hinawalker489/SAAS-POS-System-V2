"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    description: z.string().optional(),
    purchasePrice: z.coerce.number().min(0, "Price must be positive"),
    salePrice: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().int().min(0, "Stock must be positive"),
    unit: z.enum(["PCS", "KG", "BOX", "LITER", "METER"]),
    categoryId: z.string().optional(),
})

export async function createProduct(formData: FormData) {
    const businessId = await getCurrentBusinessId()

    const categoryField = formData.get("categoryId")

    const rawData = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        description: formData.get("description"),
        purchasePrice: formData.get("purchasePrice"),
        salePrice: formData.get("salePrice"),
        stock: formData.get("stock"),
        unit: formData.get("unit"),
        categoryId:
            categoryField && categoryField !== "none" ? categoryField : undefined,
    }

    const validatedData = productSchema.parse(rawData)

    await prisma.product.create({
        data: {
            ...validatedData,
            businessId,
            // If categoryId is empty string, set to undefined/null
            categoryId: validatedData.categoryId || undefined,
        }
    })

    revalidatePath("/products")
    redirect("/products")
}

export async function updateProduct(formData: FormData) {
    const businessId = await getCurrentBusinessId()
    const productId = formData.get("productId")

    if (!productId || typeof productId !== "string") {
        throw new Error("Missing product ID")
    }

    const categoryField = formData.get("categoryId")
    const rawData = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        description: formData.get("description"),
        purchasePrice: formData.get("purchasePrice"),
        salePrice: formData.get("salePrice"),
        stock: formData.get("stock"),
        unit: formData.get("unit"),
        categoryId:
            categoryField && categoryField !== "none" ? categoryField : undefined,
    }

    const validatedData = productSchema.parse(rawData)

    const existing = await prisma.product.findUnique({
        where: { id: productId },
        select: { businessId: true },
    })

    if (!existing || existing.businessId !== businessId) {
        throw new Error("Product not found")
    }

    await prisma.product.update({
        where: { id: productId },
        data: {
            ...validatedData,
            categoryId: validatedData.categoryId || undefined,
        },
    })

    revalidatePath(`/products/${productId}/edit`)
    revalidatePath("/products")
    redirect("/products")
}
