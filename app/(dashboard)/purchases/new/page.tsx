import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewPurchasePage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Add Purchase</h1>
                <p className="text-sm text-muted-foreground">
                    Detailed purchase entry will be available soon. In the meantime you
                    can track purchases manually from your suppliers.
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        The purchase creation workflow (supplier selection, line items,
                        payments) is not yet implemented in this starter project. This
                        placeholder route prevents 404 errors while you continue testing
                        the rest of the POS features.
                    </p>
                    <Link href="/purchases">
                        <Button>Back to Purchases</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

