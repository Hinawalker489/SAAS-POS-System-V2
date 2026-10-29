"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCustomer } from "@/app/actions/customers"

type CustomerInitialData = {
    id: string
    name: string
    email: string | null
    phone: string | null
    address: string | null
}

interface CustomerFormProps {
    initialData?: CustomerInitialData
    action?: (formData: FormData) => Promise<void>
    submitLabel?: string
}

export function CustomerForm({
    initialData,
    action = createCustomer,
    submitLabel = initialData ? "Save changes" : "Create Customer",
}: CustomerFormProps) {
    return (
        <form action={action} className="space-y-8 max-w-2xl">
            {initialData && (
                <input type="hidden" name="customerId" value={initialData.id} />
            )}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. John Doe"
                        required
                        defaultValue={initialData?.name ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        defaultValue={initialData?.email ?? ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+1 234 567 890"
                        defaultValue={initialData?.phone ?? ""}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City"
                    defaultValue={initialData?.address ?? ""}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit">{submitLabel}</Button>
            </div>
        </form>
    )
}
