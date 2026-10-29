import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateBusiness } from "@/app/actions/settings"

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

            <form action={updateBusiness} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Business Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Company LLC"
                                    defaultValue={business.name}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    name="currency"
                                    placeholder="USD"
                                    defaultValue={business.currency}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="hello@company.com"
                                    defaultValue={business.email || ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    defaultValue={business.phone || ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="123 Main Street, City"
                                defaultValue={business.address || ""}
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button type="submit">Save changes</Button>
                </div>
            </form>

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

