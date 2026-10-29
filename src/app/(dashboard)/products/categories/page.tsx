import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createCategory } from "@/app/actions/categories"
import { getCurrentBusinessId } from "@/lib/auth-helper"

export default async function CategoriesPage() {
    const businessId = await getCurrentBusinessId()
    const categories = await prisma.category.findMany({
        where: { businessId },
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Categories</h1>
                <p className="text-sm text-muted-foreground">
                    Manage product categories.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-fit">
                    <h2 className="font-semibold mb-4">Add Category</h2>
                    <form action={createCategory} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Electronics" required />
                        </div>
                        <Button type="submit" className="w-full">Create Category</Button>
                    </form>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category._count.products}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
