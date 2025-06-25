import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  try {
    // Check if any users exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      // Create the first admin user
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: process.env.ADMIN_EMAIL || 'admin@14voices.com',
          password: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',
          name: 'Admin User',
          role: 'admin',
        },
      })

      console.log('✅ Admin user created:', adminUser.email)
      console.log('⚠️  IMPORTANT: Change the password after first login!')
    } else {
      console.log('ℹ️  Users already exist, skipping seed')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()