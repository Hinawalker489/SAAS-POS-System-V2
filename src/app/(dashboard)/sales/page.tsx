import Link from "next/link"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default async function SalesPage() {
    const businessId = await getCurrentBusinessId()

    const sales = await prisma.sale.findMany({
        where: { businessId },
        include: {
            customer: true,
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Sales</h1>
                    <p className="text-sm text-muted-foreground">
                        View all sales transactions
                    </p>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">
                                    No sales found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.invoiceNo}</TableCell>
                                    <TableCell>
                                        {new Date(sale.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{sale.customer?.name || "Walk-in"}</TableCell>
                                    <TableCell>{sale.items.length} items</TableCell>
                                    <TableCell className="font-semibold">
                                        ${Number(sale.netAmount).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                                            {sale.paymentMethod}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/sales/${sale.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
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
