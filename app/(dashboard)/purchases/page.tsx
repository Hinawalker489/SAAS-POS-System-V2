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
import { Plus } from "lucide-react"

export default async function PurchasesPage() {
    const businessId = await getCurrentBusinessId()

    const purchases = await prisma.purchase.findMany({
        where: { businessId },
        include: {
            supplier: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { date: "desc" },
        take: 50,
    })

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Purchases</h1>
                    <p className="text-sm text-muted-foreground">
                        Track inventory purchases from suppliers
                    </p>
                </div>
                <Link href="/purchases/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Purchase
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No purchases recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            purchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">
                                        {purchase.referenceNo || purchase.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(purchase.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {purchase.supplier?.name || "Walk-in Supplier"}
                                    </TableCell>
                                    <TableCell>{purchase.items.length} items</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                                            {purchase.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ${Number(purchase.totalAmount).toFixed(2)}
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

