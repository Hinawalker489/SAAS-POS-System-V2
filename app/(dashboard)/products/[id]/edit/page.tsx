import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { ProductForm } from "@/components/products/ProductForm"
import { updateProduct } from "@/app/actions/products"
import { Card } from "@/components/ui/card"

interface EditProductPageProps {
    params: {
        id: string
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const businessId = await getCurrentBusinessId()

    const [product, categories] = await Promise.all([
        prisma.product.findFirst({
            where: {
                id: params.id,
                businessId,
            },
        }),
        prisma.category.findMany({
            where: { businessId },
            orderBy: { name: "asc" },
        }),
    ])

    if (!product) {
        notFound()
    }

    const initialData = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        description: product.description,
        purchasePrice: Number(product.purchasePrice),
        salePrice: Number(product.salePrice),
        stock: product.stock,
        unit: product.unit,
        categoryId: product.categoryId,
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
                <p className="text-sm text-muted-foreground">
                    Update product information and pricing.
                </p>
            </div>

            <Card className="p-6">
                <ProductForm
                    categories={categories}
                    initialData={initialData}
                    action={updateProduct}
                    submitLabel="Save changes"
                />
            </Card>
        </div>
    )
}

