import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
    console.log('Starting seed...')

    // Check if business already exists
    const existingBusiness = await prisma.business.findFirst()

    if (existingBusiness) {
        console.log('Business already exists, skipping seed.')
        return
    }

    const password = await hash("password123", 12)

    const business = await prisma.business.create({
        data: {
            name: "Demo Store",
            currency: "USD",
            email: "demo@store.com",
            phone: "+1234567890",
            address: "123 Main Street",
            users: {
                create: {
                    email: "admin@example.com",
                    name: "Admin User",
                    password,
                    role: "ADMIN"
                }
            }
        },
        include: {
            users: true
        }
    })

    console.log('✅ Created business:', business.name)
    console.log('✅ Created admin user:', business.users[0].email)
    console.log('📧 Email: admin@example.com')
    console.log('🔑 Password: password123')
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('✅ Seed completed successfully!')
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
