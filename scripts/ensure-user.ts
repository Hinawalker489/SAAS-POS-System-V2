import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { hash } from 'bcryptjs'

async function main() {
    console.log('Checking for admin user...')

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
        include: { business: true }
    })

    if (user) {
        console.log('✅ User already exists:', user.email)
        console.log('   BusinessId:', user.businessId)
        console.log('   Role:', user.role)
        await prisma.$disconnect()
        return
    }

    console.log('User not found, creating...')

    // Get or create business
    let business = await prisma.business.findFirst()
    if (!business) {
        business = await prisma.business.create({
            data: {
                name: "Demo Store",
                currency: "USD",
                email: "demo@store.com",
                phone: "+1234567890",
                address: "123 Main Street",
            }
        })
        console.log('✅ Created business:', business.name)
    } else {
        console.log('✅ Using existing business:', business.name)
    }

    // Create user
    const password = await hash("password123", 12)
    user = await prisma.user.create({
        data: {
            email: "admin@example.com",
            name: "Admin User",
            password,
            role: "ADMIN",
            businessId: business.id
        }
    })

    console.log('✅ Created admin user:', user.email)
    console.log('📧 Email: admin@example.com')
    console.log('🔑 Password: password123')
    console.log('   BusinessId:', user.businessId)
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('✅ Done!')
    })
    .catch(async (e) => {
        console.error('❌ Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })

