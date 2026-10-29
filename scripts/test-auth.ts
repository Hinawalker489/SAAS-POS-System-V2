import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { compare, hash } from 'bcryptjs'

async function main() {
    console.log('=== Testing Authentication Setup ===\n')

    // Check database connection
    try {
        await prisma.$connect()
        console.log('✅ Database connected')
    } catch (e) {
        console.error('❌ Database connection failed:', e)
        return
    }

    // Check if business exists
    let business = await prisma.business.findFirst()
    if (!business) {
        console.log('⚠️  No business found, creating...')
        business = await prisma.business.create({
            data: {
                name: "Demo Store",
                currency: "USD",
                email: "demo@store.com",
                phone: "+1234567890",
                address: "123 Main Street",
            }
        })
        console.log('✅ Created business:', business.id)
    } else {
        console.log('✅ Business exists:', business.id, business.name)
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
        include: { business: true }
    })

    if (!user) {
        console.log('⚠️  User not found, creating...')
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
        console.log('✅ Created user:', user.email)
    } else {
        console.log('✅ User exists:', user.email)
        console.log('   ID:', user.id)
        console.log('   BusinessId:', user.businessId)
        console.log('   Role:', user.role)
        console.log('   Has password:', !!user.password)
    }

    // Test password
    if (user && user.password) {
        const isValid = await compare("password123", user.password)
        console.log('\n=== Password Test ===')
        console.log('Password "password123" is valid:', isValid)
        if (!isValid) {
            console.log('⚠️  Password mismatch! Resetting password...')
            const newPassword = await hash("password123", 12)
            await prisma.user.update({
                where: { id: user.id },
                data: { password: newPassword }
            })
            console.log('✅ Password reset')
        }
    }

    console.log('\n=== Summary ===')
    console.log('Email: admin@example.com')
    console.log('Password: password123')
    console.log('BusinessId:', user?.businessId || 'N/A')
    console.log('\n✅ Setup complete!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })

