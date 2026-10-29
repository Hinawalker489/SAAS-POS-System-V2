import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { POSClient } from "@/components/pos/POSClient"

export default async function POSPage() {
    const businessId = await getCurrentBusinessId()

    const [products, customers] = await Promise.all([
        prisma.product.findMany({
            where: {
                businessId,
                isActive: true,
                stock: { gt: 0 }
            },
            orderBy: { name: 'asc' }
        }),
        prisma.customer.findMany({
            where: { businessId },
            orderBy: { name: 'asc' },
            select: { id: true, name: true }
        })
    ])

    return (
        <div className="flex flex-col gap-4 h-full">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Point of Sale</h1>
                <p className="text-sm text-muted-foreground">
                    Scan or search products to add to cart
                </p>
            </div>
            <POSClient
                products={products.map(p => ({
                    ...p,
                    salePrice: Number(p.salePrice)
                }))}
                customers={customers}
            />
        </div>
    )
}
