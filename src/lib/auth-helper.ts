import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getCurrentBusinessId() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.businessId) {
        throw new Error("Unauthorized: No business ID found")
    }

    return session.user.businessId
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}
