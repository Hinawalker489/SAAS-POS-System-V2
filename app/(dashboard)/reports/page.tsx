import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

export default async function ReportsPage() {
    const businessId = await getCurrentBusinessId()

    // Get sales stats
    const [totalSales, todaySales, lowStockProducts, totalRevenue] = await Promise.all([
        prisma.sale.count({ where: { businessId } }),
        prisma.sale.count({
            where: {
                businessId,
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        }),
        prisma.product.count({
            where: {
                businessId,
                stock: { lte: 10 }
            }
        }),
        prisma.sale.aggregate({
            where: { businessId },
            _sum: { netAmount: true }
        })
    ])

    const revenueAmount = Number(totalRevenue._sum.netAmount || 0)

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">
                    Overview of your business performance
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${revenueAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">All time sales</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">
                            {todaySales} sales today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockProducts}</div>
                        <p className="text-xs text-muted-foreground">Products below 10 units</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalSales > 0 ? (revenueAmount / totalSales).toFixed(2) : "0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground">Per transaction</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Detailed reports and charts coming soon...
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

