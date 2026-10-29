"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Barcode } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Product {
    id: string
    name: string
    sku: string | null
    barcode: string | null
    salePrice: number
    stock: number
    unit: string
}

interface ProductSearchProps {
    products: Product[]
    onAddToCart: (product: Product) => void
}

export function ProductSearch({ products, onAddToCart }: ProductSearchProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, SKU, or barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Barcode className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onAddToCart(product)}
                    >
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">
                                {product.sku || product.barcode || "No SKU"}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">${Number(product.salePrice).toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">
                                    Stock: {product.stock}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No products found
                </div>
            )}
        </div>
    )
}
