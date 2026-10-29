"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Category } from "@prisma/client"
import { createProduct } from "@/app/actions/products"

type ProductInitialData = {
    id: string
    name: string
    sku: string | null
    barcode: string | null
    description: string | null
    purchasePrice: number
    salePrice: number
    stock: number
    unit: string
    categoryId: string | null
}

interface ProductFormProps {
    categories: Category[]
    initialData?: ProductInitialData
    action?: (formData: FormData) => Promise<void>
    submitLabel?: string
}

export function ProductForm({
    categories,
    initialData,
    action = createProduct,
    submitLabel = initialData ? "Save changes" : "Create Product",
}: ProductFormProps) {
    return (
        <form action={action} className="space-y-8 max-w-2xl">
            {initialData && (
                <input type="hidden" name="productId" value={initialData.id} />
            )}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Wireless Mouse"
                        required
                        defaultValue={initialData?.name ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                        id="sku"
                        name="sku"
                        placeholder="e.g. WM-001"
                        defaultValue={initialData?.sku ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                        id="barcode"
                        name="barcode"
                        placeholder="Scan barcode..."
                        defaultValue={initialData?.barcode ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        name="categoryId"
                        defaultValue={initialData?.categoryId ?? undefined}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No category</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={
                            initialData
                                ? String(initialData.purchasePrice)
                                : "0"
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={
                            initialData ? String(initialData.salePrice) : "0"
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        defaultValue={
                            initialData ? String(initialData.stock) : "0"
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                        name="unit"
                        defaultValue={initialData?.unit ?? "PCS"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                            <SelectItem value="KG">Kilogram (KG)</SelectItem>
                            <SelectItem value="BOX">Box</SelectItem>
                            <SelectItem value="LITER">Liter</SelectItem>
                            <SelectItem value="METER">Meter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    placeholder="Product description..."
                    defaultValue={initialData?.description ?? ""}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit">{submitLabel}</Button>
            </div>
        </form>
    )
}
