import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentBusinessId } from "@/lib/auth-helper"
import { CustomerForm } from "@/components/customers/CustomerForm"
import { updateCustomer } from "@/app/actions/customers"
import { Card } from "@/components/ui/card"

interface EditCustomerPageProps {
    params: {
        id: string
    }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
    const businessId = await getCurrentBusinessId()

    const customer = await prisma.customer.findFirst({
        where: {
            id: params.id,
            businessId,
        },
    })

    if (!customer) {
        notFound()
    }

    const initialData = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl">Edit Customer</h1>
                <p className="text-sm text-muted-foreground">
                    Update customer contact details.
                </p>
            </div>

            <Card className="p-6">
                <CustomerForm
                    initialData={initialData}
                    action={updateCustomer}
                    submitLabel="Save changes"
                />
            </Card>
        </div>
    )
}

