import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"

export default async function ProductsPage() {
    const businessId = await getCurrentBusinessId()
    
    const products = await prisma.product.findMany({
        where: { businessId },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <div className="flex gap-2">
                    <Link href="/products/categories">
                        <Button variant="outline">
                            Manage Categories
                        </Button>
                    </Link>
                    <Link href="/products/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku || "-"}</TableCell>
                                    <TableCell>{product.category?.name || "-"}</TableCell>
                                    <TableCell>${Number(product.salePrice).toFixed(2)}</TableCell>
                                    <TableCell>{product.stock} {product.unit}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/products/${product.id}/edit`}>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </Link>
                            </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

