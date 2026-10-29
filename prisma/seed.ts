import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

async function main() {
    const password = await hash("password123", 12)

    const business = await prisma.business.create({
        data: {
            name: "Demo Store",
            currency: "USD",
            users: {
                create: {
                    email: "admin@example.com",
                    name: "Admin User",
                    password,
                    role: "ADMIN"
                }
            }
        }
    })

    console.log({ business })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
