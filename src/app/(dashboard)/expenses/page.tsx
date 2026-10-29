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

export default async function ExpensesPage() {
    const businessId = await getCurrentBusinessId()

    const expenses = await prisma.expense.findMany({
        where: { businessId },
        include: {
            user: true
        },
        orderBy: { date: 'desc' },
        take: 50
    })

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
                    <p className="text-sm text-muted-foreground">
                        Track business expenses
                    </p>
                </div>
                <Link href="/expenses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Added By</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No expenses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary">
                                            {expense.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>{expense.description || "-"}</TableCell>
                                    <TableCell>{expense.user.name}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${Number(expense.amount).toFixed(2)}
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
