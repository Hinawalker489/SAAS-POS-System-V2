"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItem {
    productId: string
    name: string
    price: number
    quantity: number
    total: number
    stock: number
}

interface CartProps {
    items: CartItem[]
    onUpdateQuantity: (productId: string, quantity: number) => void
    onRemoveItem: (productId: string) => void
    onClearCart: () => void
    discount: number
    tax: number
    onDiscountChange: (discount: number) => void
    onTaxChange: (tax: number) => void
}

export function Cart({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    discount,
    tax,
    onDiscountChange,
    onTaxChange
}: CartProps) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const total = subtotal - discount + tax

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Cart ({items.length})</CardTitle>
                {items.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearCart}>
                        Clear
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px]">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Cart is empty
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center gap-2 p-2 border rounded-lg"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        ${item.price.toFixed(2)} each
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const qty = parseInt(e.target.value) || 1
                                            onUpdateQuantity(item.productId, Math.min(qty, item.stock))
                                        }}
                                        className="h-7 w-12 text-center p-0"
                                        min={1}
                                        max={item.stock}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="text-right min-w-[60px]">
                                    <p className="font-semibold text-sm">${item.total.toFixed(2)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => onRemoveItem(item.productId)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-muted-foreground">Discount</label>
                                <Input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                    min={0}
                                    step={0.01}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Tax</label>
                                <Input
                                    type="number"
                                    value={tax}
                                    onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                    min={0}
                                    step={0.01}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Discount:</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax:</span>
                                    <span>+${tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
