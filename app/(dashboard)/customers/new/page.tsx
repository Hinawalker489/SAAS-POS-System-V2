import { CustomerForm } from "@/components/customers/CustomerForm"

export default function NewCustomerPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Add New Customer</h1>
                <p className="text-sm text-muted-foreground">
                    Create a new customer profile.
                </p>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <CustomerForm />
            </div>
        </div>
    )
}

