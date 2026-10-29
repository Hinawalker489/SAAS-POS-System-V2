"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId, getCurrentUser } from "@/lib/auth-helper"

const saleItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    total: z.number().positive(),
})

const saleSchema = z.object({
    customerId: z.string().optional(),
    items: z.array(saleItemSchema).min(1, "At least one item is required"),
    discount: z.number().min(0).default(0),
    tax: z.number().min(0).default(0),
    paymentMethod: z.enum(["CASH", "BANK", "CARD", "OTHER"]),
})

export async function createSale(data: z.infer<typeof saleSchema>) {
    const businessId = await getCurrentBusinessId()
    const user = await getCurrentUser()

    if (!user?.id) {
        throw new Error("User not authenticated")
    }

    const validatedData = saleSchema.parse(data)

    // Calculate totals
    const totalAmount = validatedData.items.reduce((sum, item) => sum + item.total, 0)
    const netAmount = totalAmount - validatedData.discount + validatedData.tax

    // Generate invoice number
    const lastSale = await prisma.sale.findFirst({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        select: { invoiceNo: true }
    })

    const lastInvoiceNum = lastSale?.invoiceNo ? parseInt(lastSale.invoiceNo.replace(/\D/g, '')) : 0
    const invoiceNo = `INV-${String(lastInvoiceNum + 1).padStart(6, '0')}`

    // Create sale with items in a transaction
    const sale = await prisma.$transaction(async (tx) => {
        // Create the sale
        const newSale = await tx.sale.create({
            data: {
                invoiceNo,
                businessId,
                userId: user.id,
                customerId: validatedData.customerId || undefined,
                totalAmount,
                discount: validatedData.discount,
                tax: validatedData.tax,
                netAmount,
                paymentMethod: validatedData.paymentMethod,
                items: {
                    create: validatedData.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    }))
                }
            },
            include: {
                items: true,
                customer: true
            }
        })

        // Update stock for each product
        for (const item of validatedData.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        return newSale
    })

    revalidatePath("/pos")
    revalidatePath("/sales")

    return { success: true, saleId: sale.id, invoiceNo: sale.invoiceNo }
}
