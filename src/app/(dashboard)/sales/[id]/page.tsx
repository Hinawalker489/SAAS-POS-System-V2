import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default async function SaleDetailsPage({
    params,
}: {
    params: { id: string }
}) {
    const businessId = await getCurrentBusinessId()

    const sale = await prisma.sale.findFirst({
        where: {
            id: params.id,
            businessId
        },
        include: {
            customer: true,
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    if (!sale) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Sale Details</h1>
                    <p className="text-sm text-muted-foreground">
                        Invoice: {sale.invoiceNo}
                    </p>
                </div>
                <Button>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sale Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Invoice No:</span>
                            <span className="font-medium">{sale.invoiceNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                                {new Date(sale.date).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span className="font-medium">{sale.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashier:</span>
                            <span className="font-medium">{sale.user.name}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">
                                {sale.customer?.name || "Walk-in Customer"}
                            </span>
                        </div>
                        {sale.customer && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{sale.customer.phone || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{sale.customer.email || "-"}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sale.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.product.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        ${Number(item.total).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${Number(sale.totalAmount).toFixed(2)}</span>
                        </div>
                        {Number(sale.discount) > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Discount:</span>
                                <span>-${Number(sale.discount).toFixed(2)}</span>
                            </div>
                        )}
                        {Number(sale.tax) > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tax:</span>
                                <span>+${Number(sale.tax).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span>${Number(sale.netAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
