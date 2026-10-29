import { prisma } from "@/lib/db"
import { ProductForm } from "@/components/products/ProductForm"
import { getCurrentBusinessId } from "@/lib/auth-helper"

export default async function NewProductPage() {
    const businessId = await getCurrentBusinessId()
    const categories = await prisma.category.findMany({
        where: {
            businessId
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Add New Product</h1>
                <p className="text-sm text-muted-foreground">
                    Create a new product for your inventory.
                </p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <ProductForm categories={categories} />
            </div>
        </div>
    )
}
