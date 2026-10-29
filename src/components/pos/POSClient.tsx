"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductSearch } from "@/components/pos/ProductSearch"
import { Cart } from "@/components/pos/Cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createSale } from "@/app/actions/sales"
import { ShoppingCart } from "lucide-react"

interface Product {
    id: string
    name: string
    sku: string | null
    barcode: string | null
    salePrice: number
    stock: number
    unit: string
}

interface Customer {
    id: string
    name: string
}

interface CartItem {
    productId: string
    name: string
    price: number
    quantity: number
    total: number
    stock: number
}

interface POSClientProps {
    products: Product[]
    customers: Customer[]
}

export function POSClient({ products, customers }: POSClientProps) {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string>("CASH")
    const [discount, setDiscount] = useState(0)
    const [tax, setTax] = useState(0)
    const [loading, setLoading] = useState(false)

    const handleAddToCart = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert("Not enough stock")
                    return prev
                }
                return prev.map(item =>
                    item.productId === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            total: (item.quantity + 1) * item.price
                        }
                        : item
                )
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    price: Number(product.salePrice),
                    quantity: 1,
                    total: Number(product.salePrice),
                    stock: product.stock
                }
            ]
        })
    }

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return
        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity, total: quantity * item.price }
                    : item
            )
        )
    }

    const handleRemoveItem = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId))
    }

    const handleClearCart = () => {
        setCartItems([])
        setDiscount(0)
        setTax(0)
        setSelectedCustomer("")
    }

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Cart is empty")
            return
        }

        setLoading(true)
        try {
            const result = await createSale({
                customerId: selectedCustomer || undefined,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total
                })),
                discount,
                tax,
                paymentMethod: paymentMethod as "CASH" | "BANK" | "CARD" | "OTHER"
            })

            if (result.success) {
                alert(`Sale completed! Invoice: ${result.invoiceNo}`)
                handleClearCart()
                router.refresh()
            }
        } catch (error) {
            console.error("Checkout error:", error)
            alert("Failed to complete sale")
        } finally {
            setLoading(false)
        }
    }

    const total = cartItems.reduce((sum, item) => sum + item.total, 0) - discount + tax

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductSearch products={products} onAddToCart={handleAddToCart} />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Cart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    discount={discount}
                    tax={tax}
                    onDiscountChange={setDiscount}
                    onTaxChange={setTax}
                />

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Customer (Optional)</label>
                            <Select
                                value={selectedCustomer ?? "WALK_IN"}
                                onValueChange={(value) =>
                                    setSelectedCustomer(value === "WALK_IN" ? null : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Walk-in customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WALK_IN">Walk-in customer</SelectItem>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Payment Method</label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="CARD">Card</SelectItem>
                                    <SelectItem value="BANK">Bank Transfer</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0 || loading}
                        >
                            {loading ? "Processing..." : `Checkout - $${total.toFixed(2)}`}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
