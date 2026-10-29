import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default async function SettingsPage() {
    const businessId = await getCurrentBusinessId()

    const business = await prisma.business.findUnique({
        where: { id: businessId }
    })

    if (!business) {
        return <div>Business not found</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your business settings
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input value={business.name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Input value={business.currency} disabled />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={business.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={business.phone || ""} disabled />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={business.address || ""} disabled />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Settings editing will be available in a future update.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Business ID:</span>
                        <span className="font-mono">{business.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(business.createdAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
